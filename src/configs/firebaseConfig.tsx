// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1vURkgCsztTToZh38KS5OpwBiN0a_fpw",
    authDomain: "productos-app-203e4.firebaseapp.com",
    projectId: "productos-app-203e4",
    storageBucket: "productos-app-203e4.appspot.com",
    messagingSenderId: "61545655714",
    appId: "1:61545655714:web:cb9c338237f527659cd6fb",
    databaseURL: "https://productos-app-203e4-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//export const auth = getAuth(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const dbRealTime = getDatabase(app)

