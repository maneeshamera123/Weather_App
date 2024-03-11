import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCc_1zGpoQsgJonO3SH24KJ68cpFL2Uc5c",
    authDomain: "weatherapp-69015.firebaseapp.com",
    projectId: "weatherapp-69015",
    storageBucket: "weatherapp-69015.appspot.com",
    messagingSenderId: "989345211952",
    appId: "1:989345211952:web:7fd5fde8bf78a256efeff5",
    measurementId: "G-CTEY74EJ6S"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);