<template>
  <div class="weather-page">
    <h1>WEATHER APP</h1>

    <form @submit.prevent="searchByCity">
      <input
        v-model="city"
        aria-label="City name"
        :disabled="loading"
        type="text"
        placeholder="Enter city name, e.g. Clayton, AU"
      />
      <button type="submit" :disabled="loading">Get Weather</button>
    </form>

    <button @click="fetchCurrentLocationWeather" :disabled="loading">Current Location</button>

    <p v-if="loading" role="status">Loading weather...</p>
    <p v-if="error" role="alert">{{ error }}</p>

    <main v-if="weatherData">
      <p>{{ locationSource }}</p>
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>

      <img :src="iconUrl" :alt="weatherData.weather[0].description" width="100" height="100" />

      <p>{{ temperature }} °C</p>
      <p>{{ weatherData.weather[0].description }}</p>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim()
const city = ref('')
const weatherData = ref(null)
const error = ref(null)
const loading = ref(false)
const locationSource = ref('')

const temperature = computed(() => {
  return weatherData.value ? weatherData.value.main.temp.toFixed(2) : null
})

const iconUrl = computed(() => {
  const icon = weatherData.value?.weather[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
})

const fetchWeatherData = async (params, source) => {
  if (!apiKey) {
    error.value = 'Weather API key is not configured. Set VITE_OPENWEATHER_API_KEY and rebuild.'
    return
  }

  loading.value = true
  error.value = null
  weatherData.value = null

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        ...params,
        appid: apiKey,
        units: 'metric',
      },
      timeout: 15000,
    })

    weatherData.value = response.data
    locationSource.value = source
  } catch (err) {
    const status = err.response?.status

    if (status === 401) {
      error.value = 'API key is invalid or not yet activated.'
    } else if (status === 404) {
      error.value = 'City not found. Try Clayton, AU.'
    } else if (status === 429) {
      error.value = 'Weather request limit reached. Please try again later.'
    } else {
      error.value = 'Unable to fetch weather. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const searchByCity = async () => {
  const query = city.value.trim()

  if (!query) {
    error.value = 'Please enter a city name.'
    return
  }

  await fetchWeatherData({ q: query }, `City search: ${query}`)
}

const fetchCurrentLocationWeather = () => {
  error.value = null
  weatherData.value = null

  if (!apiKey) {
    error.value = 'Weather API key is not configured. Set VITE_OPENWEATHER_API_KEY and rebuild.'
    return
  }

  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by this browser.'
    return
  }

  loading.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords

      await fetchWeatherData({ lat: latitude, lon: longitude }, 'Weather for your current location')
    },
    (positionError) => {
      loading.value = false
      error.value =
        positionError.code === 1
          ? 'Location access denied. Enter a city name to get weather instead.'
          : 'Unable to get your location. Enter a city name or try again.'
    },
    { timeout: 15000 },
  )
}
</script>

<style scoped>
.weather-page {
  max-width: 650px;
  margin: 30px auto;
  text-align: center;
}

form {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

input {
  width: 320px;
  max-width: 70%;
  padding: 8px;
}

button {
  padding: 8px 12px;
}
</style>
