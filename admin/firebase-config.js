
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForTesting123456789",
    authDomain: "rentinplk.firebaseapp.com",
    projectId: "rentinplk",
    storageBucket: "rentinplk.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
