import { computed, shallowRef, ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './init'

const adminUids = new Set(['fXQHaNJklEfxtsVkJh49JF6YYJL2'])

export const currentUser = shallowRef(null)
export const authReady = ref(false)
export const role = computed(() => {
  if (!currentUser.value) return 'Guest'
  return adminUids.has(currentUser.value.uid) ? 'Admin' : 'Member'
})

export function logCurrentUser() {
  const user = auth.currentUser
  // Log a snapshot without passwords or authentication tokens.
  console.log(
    'Current user:',
    user
      ? {
          uid: user.uid,
          email: user.email,
          role: adminUids.has(user.uid) ? 'Admin' : 'Member',
        }
      : null,
  )
}

const unsubscribe = onAuthStateChanged(auth, (user) => {
  currentUser.value = user
  authReady.value = true
  logCurrentUser()
})

if (import.meta.hot) import.meta.hot.dispose(unsubscribe)
