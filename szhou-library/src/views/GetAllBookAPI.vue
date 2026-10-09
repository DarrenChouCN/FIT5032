<template>
  <pre v-if="jsondata !== null">{{ jsondata }}</pre>
  <p v-else-if="error">{{ error }}</p>
  <p v-else>Loading...</p>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const jsondata = ref(null)
const error = ref(null)

const getAllBookAPI = async () => {
  try {
    const response = await axios.get(
      'https://us-central1-fit5032-5c5f1.cloudfunctions.net/getAllBooks',
    )
    jsondata.value = JSON.stringify(response.data, null, 2)
    error.value = null
  } catch (err) {
    error.value = 'Error fetching books'
    jsondata.value = null
    console.error(err)
  }
}

onMounted(() => {
  getAllBookAPI()
})
</script>
