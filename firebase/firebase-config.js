import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCt8f6QWAtqlJKXqK5gTw72vFnDtCngEDU",
    authDomain: "chat-app-ec51e.firebaseapp.com",
    projectId: "chat-app-ec51e",
    storageBucket: "chat-app-ec51e.appspot.com",
    messagingSenderId: "970086752193",
    appId: "1:970086752193:web:cd1dd4705cb3122b789940"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const authentication = getAuth(app);