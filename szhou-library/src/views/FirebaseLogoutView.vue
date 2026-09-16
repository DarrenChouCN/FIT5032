<script setup>
import { ref } from 'vue'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/init'
import { currentUser, authReady, logCurrentUser } from '../firebase/session'

const error = ref('')
const busy = ref(false)

async function logout() {
  busy.value = true
  error.value = ''
  try {
    await signOut(auth)
    console.log('Firebase sign out successful')
    logCurrentUser()
  } catch (err) {
    error.value = err.code || err.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main class="container mt-4" style="max-width: 560px">
    <h1>Firebase Log Out</h1>
    <p v-if="!authReady">Loading session...</p>
    <section v-else-if="currentUser">
      <p>Signed in as {{ currentUser.email }}</p>
      <button class="btn btn-danger" :disabled="busy" @click="logout">
        {{ busy ? 'Signing out...' : 'Confirm log out' }}
      </button>
    </section>
    <section v-else class="alert alert-success">
      <p>You are signed out.</p>
      <p>Current user: null</p>
      <button class="btn btn-outline-secondary mb-3" @click="logCurrentUser">
        Show current user in console
      </button>
      <RouterLink to="/FireLogin" class="d-block">Back to sign in</RouterLink>
    </section>
    <p v-if="error" class="alert alert-danger mt-3" role="alert">{{ error }}</p>
  </main>
</template>
