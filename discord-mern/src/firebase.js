import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjnNlYXgN5l0WlWYh8kNIX7Uk-uJhZN6c",
  authDomain: "discord-fd138.firebaseapp.com",
  databaseURL: "https://discord-fd138.asia-southeast2.firebasedatabase.app",
  projectId: "discord-fd138",
  storageBucket: "discord-fd138.appspot.com",
  messagingSenderId: "625159532449",
  appId: "1:625159532449:web:47dfe6271d1e2dd97025e0",
  measurementId: "G-7390BYHB03",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
