// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCXRWvgl2cXkv9_9aNaP1E9mkPDIWMlBWQ',
  authDomain: 'fit5032-5c5f1.firebaseapp.com',
  projectId: 'fit5032-5c5f1',
  storageBucket: 'fit5032-5c5f1.firebasestorage.app',
  messagingSenderId: '792582299057',
  appId: '1:792582299057:web:4c6cda467bb4addef2f190',
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
