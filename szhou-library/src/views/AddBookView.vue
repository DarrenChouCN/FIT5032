<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase/db'
import { authReady, currentUser } from '../firebase/session'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')
const message = ref('')
const error = ref('')
const busy = ref(false)
const revision = ref(0)

async function addBook() {
  message.value = ''
  error.value = ''
  const number = Number(isbn.value)
  if (!name.value.trim() || !Number.isSafeInteger(number) || number <= 0) {
    error.value = 'Enter a book name and a positive whole-number ISBN.'
    return
  }
  busy.value = true
  try {
    const result = await addDoc(collection(db, 'books'), {
      isbn: number,
      name: name.value.trim(),
    })
    message.value = `Added: ${name.value.trim()} (ISBN ${number}). Document: ${result.id}`
    revision.value++
    name.value = ''
    isbn.value = ''
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="container my-4" style="max-width: 960px">
    <h1>Add Book</h1>
    <p v-if="!authReady">Loading session...</p>
    <p v-else-if="!currentUser" class="alert alert-info">
      Please <RouterLink to="/FireLogin">sign in</RouterLink> before managing books.
    </p>
    <template v-else>
      <form class="card p-3 mb-3" @submit.prevent="addBook">
        <fieldset :disabled="busy">
          <div class="row g-3 align-items-end">
            <div class="col-sm-3">
              <label for="isbn" class="form-label">ISBN</label>
              <input
                id="isbn"
                v-model="isbn"
                type="number"
                min="1"
                step="1"
                required
                class="form-control"
              />
            </div>
            <div class="col-sm-6">
              <label for="book-name" class="form-label">Book name</label>
              <input id="book-name" v-model="name" required class="form-control" />
            </div>
            <div class="col-sm-3">
              <button class="btn btn-primary">{{ busy ? 'Adding...' : 'Add Book' }}</button>
            </div>
          </div>
        </fieldset>
      </form>
      <p v-if="message" class="alert alert-success" role="status">{{ message }}</p>
      <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
      <BookList :key="revision" />
    </template>
  </div>
</template>
