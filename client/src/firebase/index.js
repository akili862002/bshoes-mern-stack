import firebase from 'firebase/app';
import "firebase/storage";

const config = {
    apiKey: "AIzaSyC00fzkUabGu_ooDTCzjUGdvdkJmX7C57Y",
    authDomain: "bshoes-2.firebaseapp.com",
    databaseURL: "https://bshoes-2.firebaseio.com",
    projectId: "bshoes-2",
    storageBucket: "bshoes-2.appspot.com",
    messagingSenderId: "753076909777",
    appId: "1:753076909777:web:c98169181a3fd45c4ff7f0",
    measurementId: "G-SS8N9RWQ1M"
};

firebase.initializeApp(config);

const storage = firebase.storage();

export { storage, firebase as default };