import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCqD29Mat9OEPOCnT6dfu_CabQYqSLJQnc',
    authDomain: 'snowpet-app.firebaseapp.com',
    projectId: 'snowpet-app',
    storageBucket: 'snowpet-app.appspot.com',
    messagingSenderId: '863783563282',
    appId: '1:863783563282:android:1278e5e77067ac4ccd28cb',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const FIREBASE_APP = app;
export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_DB = getFirestore(app);
