import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyCQjypVCa4zB_iDzIUaU5BCFvOge9wuUo8",
    authDomain: "scheduley-c5f7e.firebaseapp.com",
    projectId: "scheduley-c5f7e",
    storageBucket: "scheduley-c5f7e.appspot.com",
    messagingSenderId: "846885356722",
    appId: "1:846885356722:web:7b98139bc3c4092ccaf5ab"
  };

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export {db, auth}