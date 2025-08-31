// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  projectId: 'visionboard-e3o1o',
  appId: '1:979638584673:web:2cc532a5a4632488c5b120',
  storageBucket: 'visionboard-e3o1o.firebasestorage.app',
  apiKey: 'AIzaSyCsnXq7g5TjPJsSItDH6Kf1G_CrlFGCEik',
  authDomain: 'visionboard-e3o1o.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '979638584673',
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export { app };
