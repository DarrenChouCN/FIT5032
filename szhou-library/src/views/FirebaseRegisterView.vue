<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase/init'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

async function register() {
  busy.value = true
  error.value = ''
  try {
    await createUserWithEmailAndPassword(auth, email.value.trim(), password.value)
    console.log('Firebase registration successful')
    // Firebase automatically signs in new accounts. Sign out to test login separately.
    await signOut(auth)
    await router.push({ name: 'FireLogin', query: { registered: '1' } })
  } catch (err) {
    error.value = err.code || err.message
  } finally {
    password.value = ''
    busy.value = false
  }
}
</script>

<template>
  <main class="container mt-4" style="max-width: 560px">
    <h1>Create an Account</h1>
    <form @submit.prevent="register">
      <label for="register-email" class="form-label">Email</label>
      <input
        id="register-email"
        v-model="email"
        type="email"
        class="form-control mb-3"
        autocomplete="email"
        required
      />
      <label for="register-password" class="form-label">Password</label>
      <input
        id="register-password"
        v-model="password"
        type="password"
        class="form-control mb-3"
        autocomplete="new-password"
        minlength="6"
        required
      />
      <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
      <button class="btn btn-primary" :disabled="busy">
        {{ busy ? 'Creating account...' : 'Save to Firebase' }}
      </button>
    </form>
    <RouterLink to="/FireLogin" class="d-block mt-3">Already registered? Sign in</RouterLink>
  </main>
</template>
