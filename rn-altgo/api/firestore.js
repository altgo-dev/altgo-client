import firebase from 'firebase'
import 'firebase/firestore'
var config = {
    apiKey: "AIzaSyDZ0jRBNC1x_KeAACF54Aon7cc2GRvt7Kg",
    authDomain: "altgo-5a39d.firebaseapp.com",
    databaseURL: "https://altgo-5a39d.firebaseio.com",
    projectId: "altgo-5a39d",
    storageBucket: "altgo-5a39d.appspot.com",
    messagingSenderId: "436862673239"
  }

firebase.initializeApp(config)
const db = firebase.firestore()

export {
    firebase, db
}