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

  /*
  creates and stores a new user into firebase. Also creates a new test round and stores its id at the users test array
  afterwards the callback with the newly created UserID and TestID is called
  */
  function newUserEntry(callback) {
    //create test result entry
    db.collection("test_results").add({
      corrPhish:0,
      corrAuth:0,
      missPhish:0,
      missAuth:0

    }).then(function (test_result_Ref) {
      //create user entry and insert test result entry id in tests array
      db.collection("users").add({
        tests:[test_result_Ref.id]

      }).then(function (user_Ref) {
         callback(user_Ref.id, test_result_Ref.id);
      })
      .catch(function (error) {
        console.log("Error creating user: ", error);
      });
    })
    .catch(function (error) {
      console.log("Error creating round: ", error);
    });
  }

  /*
  Creates a new test_round and appends the id to the users tests
  Afterwards calls the callback with the test_results_ID of the newly created round
  */
  function newRound(fireUserID, callback, storeNewUserCallback) {
    db.collection("test_results").add({
      corrPhish:0,
      corrAuth:0,
      missPhish:0,
      missAuth:0

    }).then(function (test_result_Ref) {
      //create user entry and insert test result entry id in tests array
      db.collection("users").doc(fireUserID).update({
        tests: firebase.firestore.FieldValue.arrayUnion(test_result_Ref.id)

      }).catch(function (error) {
        console.log("Error adding round ID");
        console.log("creating new user");
        newUserEntry(storeNewUserCallback);
        return;
      });

      callback(test_result_Ref.id);
    })
    .catch(function (error) {
      console.log("Error creating round: ", error);
    });
  }

  //updates the stats of the given test_results_ID
  function updateStats(testID, roundStats) {
    db.collection("test_results").doc(testID).set({
      corrPhish:roundStats[0],
      corrAuth:roundStats[1],
      missPhish:roundStats[2],
      missAuth:roundStats[3]
    }).catch(function (error) {
      console.error("Error updating stats: ", error);
    });
  }

  return {
    newUserEntry:newUserEntry,
    updateStats:updateStats,
    newRound:newRound
  };
})();
