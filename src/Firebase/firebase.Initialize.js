import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.Config";


const initializeAuthn = () => {
    initializeApp(firebaseConfig);
};

export default initializeAuthn;