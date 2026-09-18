<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase/db'

const books = ref([])
const mode = ref('where')
const busy = ref(false)
const error = ref('')
const message = ref('')
const editId = ref(null)
const editName = ref('')
const editIsbn = ref('')
const title = computed(
  () =>
    ({
      all: 'All books',
      where: 'Books with ISBN > 1000',
      top: 'ISBN > 1000, descending, first 2 books',
    })[mode.value],
)

async function fetchBooks() {
  const booksRef = collection(db, 'books')
  let request = query(booksRef)
  if (mode.value === 'where') {
    request = query(booksRef, where('isbn', '>', 1000))
  } else if (mode.value === 'top') {
    request = query(booksRef, where('isbn', '>', 1000), orderBy('isbn', 'desc'), limit(2))
  }
  const snapshot = await getDocs(request)
  books.value = snapshot.docs.map((record) => ({ ...record.data(), id: record.id }))
}

async function loadBooks(nextMode = mode.value) {
  busy.value = true
  error.value = ''
  message.value = ''
  books.value = []
  editId.value = null
  mode.value = nextMode
  try {
    await fetchBooks()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

function startEdit(book) {
  editId.value = book.id
  editName.value = book.name
  editIsbn.value = book.isbn
}

async function saveBook() {
  error.value = ''
  message.value = ''
  const number = Number(editIsbn.value)
  if (!editName.value.trim() || !Number.isSafeInteger(number) || number <= 0) {
    error.value = 'Enter a book name and a positive whole-number ISBN.'
    return
  }
  busy.value = true
  try {
    await updateDoc(doc(db, 'books', editId.value), {
      name: editName.value.trim(),
      isbn: number,
    })
    message.value = `Updated: ${editName.value.trim()} (ISBN ${number}).`
    editId.value = null
    await fetchBooks()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function removeBook(book) {
  if (!window.confirm(`Delete "${book.name}"?`)) return
  busy.value = true
  error.value = ''
  message.value = ''
  try {
    await deleteDoc(doc(db, 'books', book.id))
    message.value = `Deleted: ${book.name} (ISBN ${book.isbn}).`
    editId.value = null
    await fetchBooks()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

onMounted(() => loadBooks())
</script>

<template>
  <section class="card p-3">
    <h2>{{ title }}</h2>
    <div class="d-flex gap-2 flex-wrap my-2">
      <button class="btn btn-outline-secondary" :disabled="busy" @click="loadBooks('all')">
        All books
      </button>
      <button class="btn btn-outline-primary" :disabled="busy" @click="loadBooks('where')">
        ISBN > 1000
      </button>
      <button class="btn btn-outline-primary" :disabled="busy" @click="loadBooks('top')">
        ISBN > 1000 / DESC / Limit 2
      </button>
    </div>
    <p v-if="busy" role="status">Working...</p>
    <p v-if="message" class="alert alert-success" role="status">{{ message }}</p>
    <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
    <p v-if="!busy && !error">{{ books.length }} book(s) returned.</p>
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Book name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.isbn }}</td>
            <td>{{ book.name }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                :disabled="busy"
                @click="startEdit(book)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                :disabled="busy"
                @click="removeBook(book)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <form v-if="editId" @submit.prevent="saveBook">
      <fieldset :disabled="busy">
        <legend class="h5">Edit book</legend>
        <label for="edit-isbn" class="form-label">ISBN</label>
        <input
          id="edit-isbn"
          v-model="editIsbn"
          type="number"
          min="1"
          step="1"
          required
          class="form-control mb-2"
        />
        <label for="edit-name" class="form-label">Book name</label>
        <input id="edit-name" v-model="editName" required class="form-control mb-2" />
        <button class="btn btn-primary me-2">Save changes</button>
        <button type="button" class="btn btn-secondary" @click="editId = null">Cancel</button>
      </fieldset>
    </form>
  </section>
</template>
