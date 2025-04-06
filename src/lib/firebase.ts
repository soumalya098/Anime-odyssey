
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5m3B1eoXeSOms87Eci5JbLb7NDIAMsZE",
  projectId: "anime-blog-site",
  storageBucket: "anime-blog-site.appspot.com",
  messagingSenderId: "285102738205",
  appId: "1:285102738205:web:81cf8257888a2cf2e3eff4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
