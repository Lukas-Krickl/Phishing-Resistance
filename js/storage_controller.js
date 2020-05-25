"use strict";
const storageControllerModule = (function () {
  const localStore = window.localStorage;
  var roundStats;
  var fireUserID;
  var currentTestID;

  function readRoundStats() {
    roundStats = localStore.getItem("roundStats");
    if (roundStats) {
      try {
        console.log("stored rounds: "+roundStats);
        roundStats = JSON.parse(roundStats);
      } catch (e) {
        console.log("error on parsing userstats: "+JSON.stringify(e));
        roundStats = {
          remainingQuestions:15,
          current:[0,0,0,0],
          previous:[]
        };
      }
    } else {
      roundStats = {
        remainingQuestions:15,
        current:[0,0,0,0],
        previous:[]
      };
      console.log("new roundStats initialized");
    }
  }

  function writeRoundstats() {
    localStore.setItem("roundStats", JSON.stringify(roundStats));
  }

  function getRoundStats() {
    return roundStats;
  }

  function nextRound() {
    if (roundStats.remainingQuestions!=0) {
      console.error("switched to next round but there were "+ remainingQuestions+" questions left");
    }
    roundStats.remainingQuestions = 15;
    roundStats.previous.push(roundStats.current);
    roundStats.current = [0,0,0,0];
    writeRoundstats();
    console.log("switched to next round");
  }

  //increases the counter of one answer result, returns true if this round is finished
  function addResult(resultProppertyName) {
    if (roundStats.remainingQuestions === 0) {
      console.error("round has ended, switch to next round!");
      return;
    }

    switch (resultProppertyName) {
      case "corrPhish":
        roundStats.current[0]++;
        break;
      case "corrAuth":
        roundStats.current[1]++;
        break;
      case "missPhish":
        roundStats.current[2]++;
        break;
      case "missAuth":
        roundStats.current[3]++;
        break;
      default:
        console.error("invalid result name");
        return;
    }
    roundStats.remainingQuestions--;
    writeRoundstats();
  }

  function hasRoundEnded() {
    return roundStats.remainingQuestions === 0;
  }

  function getTotalStats() {
    let totalStats = [0,0,0,0];
    //add all previous rounds
    for (var i = 0; i < roundStats.previous.length; i++) {
      for (var k = 0; k < 4; k++) {
        totalStats[k] += roundStats.previous[i][k];
      }
    }
    //add current round
    for (var k = 0; k < 4; k++) {
      totalStats[k] += roundStats.current[k];
    }
    return totalStats;
  }

  // read fireID and if its set return true, return false if not found
  function readFireUser() {
    fireUserID = localStore.getItem("fireUserID");
    console.log("User read");
    if (fireUserID) {
      currentTestID = localStore.getItem("currentTestID");
      if (currentTestID) {
        console.log("Tests read");
        return true;
      }
    }
    return false;
  }

  function getFireUserID() {
    return fireUserID;
  }

  function storeNewFireUser(newFireUserID, newTestID) {
    //store user
    fireUserID = newFireUserID;
    localStore.setItem("fireUserID", fireUserID);
    console.log("User stored");
    //store test
    storeCurrentTestID(newTestID);
  }

  function getCurrentTestID() {
    return currentTestID;
  }

  function storeCurrentTestID(testID) {
    currentTestID = testID;
    localStore.setItem("currentTestID", currentTestID);
    console.log("Tests stored");
  }

  readRoundStats();

  return {
    readRoundStats:readRoundStats,
    getRoundStats:getRoundStats,
    getTotalStats:getTotalStats,
    addResult:addResult,
    hasRoundEnded:hasRoundEnded,
    nextRound:nextRound,
    storeNewFireUser:storeNewFireUser,
    readFireUser:readFireUser,
    getFireUserID:getFireUserID,
    getCurrentTestID:getCurrentTestID,
    storeCurrentTestID:storeCurrentTestID
  };

})();
