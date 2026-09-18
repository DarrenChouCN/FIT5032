import { getFirestore } from 'firebase/firestore'
import { auth } from './init'

export const db = getFirestore(auth.app)
