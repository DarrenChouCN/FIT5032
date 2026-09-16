<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/init'
import { currentUser, authReady, role, logCurrentUser } from '../firebase/session'

const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

async function signin() {
  busy.value = true
  error.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
    console.log('Firebase sign in successful')
    logCurrentUser()
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
    <h1>Firebase Sign In</h1>
    <p v-if="!authReady">Loading session...</p>
    <section v-else-if="currentUser" class="card p-3">
      <h2>Signed in successfully</h2>
      <p><strong>Email:</strong> {{ currentUser.email }}</p>
      <p class="text-break"><strong>UID:</strong> {{ currentUser.uid }}</p>
      <p><strong>Role:</strong> {{ role }}</p>
      <div v-if="role === 'Admin'" class="alert alert-warning">
        <strong>Admin area</strong> — Welcome, library administrator.
      </div>
      <div v-else class="alert alert-info">
        <strong>Member area</strong> — Welcome, library member.
      </div>
      <button class="btn btn-outline-secondary mb-2" @click="logCurrentUser">
        Show current user in console
      </button>
      <RouterLink to="/FireLogout" class="btn btn-danger">Log out</RouterLink>
    </section>
    <form v-else @submit.prevent="signin">
      <p v-if="route.query.registered" class="alert alert-success">
        Registration successful. Please sign in.
      </p>
      <label for="login-email" class="form-label">Email</label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        class="form-control mb-3"
        autocomplete="username"
        required
      />
      <label for="login-password" class="form-label">Password</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        class="form-control mb-3"
        autocomplete="current-password"
        required
      />
      <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
      <button class="btn btn-primary" :disabled="busy">
        {{ busy ? 'Signing in...' : 'Sign in via Firebase' }}
      </button>
    </form>
  </main>
</template>
