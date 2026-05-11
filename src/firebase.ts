import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
// Enable long polling to bypass strict network restrictions or ad blockers that might block WebSockets
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();

// Export the app instance
export default app;
