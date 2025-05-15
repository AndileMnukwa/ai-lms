import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-GdwzSSL1cRpSmzZnXN4YQh0G_Y9auGQ",
  authDomain: "ai-lms-f779f.firebaseapp.com",
  projectId: "ai-lms-f779f",
  storageBucket: "ai-lms-f779f.appspot.com",
  messagingSenderId: "1067722816843",
  appId: "1:1067722816843:web:18def2666b2f5f7f08bcce",
  measurementId: "G-R1YXG07922",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }
