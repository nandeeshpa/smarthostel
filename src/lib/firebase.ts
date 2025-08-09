import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCqbC52Gv_Zd0ukrUNA9ZFG0otoc3ZkPUs',
  authDomain: 'hostel360-3a83c.firebaseapp.com',
  projectId: 'hostel360-3a83c',
  storageBucket: 'hostel360-3a83c.firebasestorage.app',
  messagingSenderId: '152825928654',
  appId: '1:152825928654:web:8ed3c48c424c9ee3f5299f',
  measurementId: 'G-9J46CCER45',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);


