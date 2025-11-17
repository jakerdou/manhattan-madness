import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

type EnvConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

function getEnv(): EnvConfig {
  const env = import.meta.env
  const cfg: EnvConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  }
  for (const [k, v] of Object.entries(cfg)) {
    if (!v && k !== 'measurementId') {
      throw new Error(`Missing Firebase env: ${k}`)
    }
  }
  return cfg
}

let app: FirebaseApp
let db: Firestore
let auth: Auth
let storage: FirebaseStorage

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const config = getEnv()
    app = getApps().length ? getApps()[0]! : initializeApp(config)
  }
  return app
}

export function getDb(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp())
  return db
}

export function getAuthInstance(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp())
  return auth
}

export function getStorageInstance(): FirebaseStorage {
  if (!storage) storage = getStorage(getFirebaseApp())
  return storage
}

export async function ensureAnonymousAuth(): Promise<void> {
  const a = getAuthInstance()
  if (!a.currentUser) {
    await signInAnonymously(a)
  }
}
