"use strict";
const firestore_controller_module = (function () {
  var firebaseConfig = {
    apiKey: "AIzaSyChMpmT2qifFjZ-mMFV5dl9ji3RJ-szcC0",
    authDomain: "phishing-resistance.firebaseapp.com",
    databaseURL: "https://phishing-resistance.firebaseio.com",
    projectId: "phishing-resistance",
    storageBucket: "phishing-resistance.appspot.com",
    messagingSenderId: "728503074174",
    appId: "1:728503074174:web:f3de584083755dd60a872f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  //create new stats entry and returns the identifier
  function newEntry(callback) {

    db.collection("test_results").add({
      corrPhish:0,
      corrAuth:0,
      missPhish:0,
      missAuth:0
    })
    .then(function (docRef, id) {
       callback(docRef.id);
    })
    .catch(function (error) {
      console.log("Error creating document: ", error);
    });
  }

  //updates the stats of the given id
  function updateStats(id, userStats) {
    db.collection("test_results").doc(id).set({
      corrPhish:userStats[0],
      corrAuth:userStats[1],
      missPhish:userStats[2],
      missAuth:userStats[3]
    }).catch(function (error) {
      console.error("Error updating stats: ", error);
    });
  }

  return {
    newEntry:newEntry,
    updateStats:updateStats
  };
})();
