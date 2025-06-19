// services/firebaseConfig.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyCqD29Mat9OEPOCnT6dfu_CabQYqSLJQnc',
    authDomain: 'snowpet-app.firebaseapp.com',
    projectId: 'snowpet-app',
    storageBucket: 'snowpet-app.appspot.com',
    messagingSenderId: '863783563282',
    appId: '1:863783563282:android:1278e5e77067ac4ccd28cb',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
