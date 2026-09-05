import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: วางค่า config จากโปรเจกต์ Firebase ของคุณเองที่นี่
// Firebase Console > Project settings > General > Your apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeYE_rCkWLTORnrUiDaDaQvS8d4_cuIjo",
  authDomain: "kinn-4f2d6.firebaseapp.com",
  projectId: "kinn-4f2d6",
  storageBucket: "kinn-4f2d6.firebasestorage.app",
  messagingSenderId: "577349646449",
  appId: "1:577349646449:web:f8157bc558b86bc8c5c3d0"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// On native (iOS/Android) we need to explicitly attach AsyncStorage so the
// logged-in session survives an app restart. On web, the default getAuth is fine.
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // initializeAuth throws if it was already called once (e.g. fast refresh)
    auth = getAuth(app);
  }
}

const db = getFirestore(app);

export { app, auth, db };
