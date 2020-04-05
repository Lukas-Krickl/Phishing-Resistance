"use strict";
var resultModule = (function () {
  var userStats;
  if (document.cookie) {
    userStats = JSON.parse(document.cookie);
    console.log("exisiting user: "+document.cookie);
  } else {
    userStats = [0,0,0,0];
    console.log("new user initialized");
  }

  var totalQuestions = 0;
  for (var i = 0; i < userStats.length; i++) {
    totalQuestions+=userStats[i];
  }

  //total result bar
  var totalStatsController = {
    totalResults : document.getElementById('totalResults'),
    totalCorrect : totalResults.getElementsByTagName("div")[0],
    totalMiss : totalResults.getElementsByTagName("div")[1],
  };

  function setTotalResult(userStatsArray) {
    let correctPercent = 0;
    let incorrectPercent = 0;
    if (totalQuestions != 0) {
      correctPercent = ((userStatsArray[0] + userStatsArray[1]) * 100 / totalQuestions).toFixed(2);
      incorrectPercent = (100 - correctPercent).toFixed(2);
    }

    totalStatsController.totalCorrect.innerHTML = correctPercent + "%";
    totalStatsController.totalCorrect.style.flexGrow = correctPercent;
    totalStatsController.totalMiss.innerHTML = incorrectPercent + "%";
    totalStatsController.totalMiss.style.flexGrow = incorrectPercent;
  }

  //detailed result table

  const detailedTable = document.getElementById('detailedTable');
  const tableRows = detailedTable.getElementsByTagName("tr");

  var tableController = {
    correctPhish : {
      amount : tableRows[0].getElementsByTagName("td")[1],
      percent : tableRows[0].getElementsByTagName('td')[2]
    },
    correctAuth : {
      amount : tableRows[1].getElementsByTagName('td')[1],
      percent : tableRows[1].getElementsByTagName('td')[2]
    },
    missPhish : {
      amount : tableRows[2].getElementsByTagName('td')[1],
      percent : tableRows[2].getElementsByTagName('td')[2]
    },
    missAuth : {
      amount : tableRows[3].getElementsByTagName('td')[1],
      percent : tableRows[3].getElementsByTagName('td')[2]
    }
  };


  var tableEntries = [tableController.correctPhish, tableController.correctAuth, tableController.missPhish, tableController.missAuth];

  function setDetailedTable(userStatsArray) {
    for (var i = 0; i < tableEntries.length; i++) {
      tableEntries[i].amount.innerHTML = userStatsArray[i];
      if (totalQuestions ==0) {
        tableEntries[i].percent.innerHTML ="0.00%";
      } else {
        tableEntries[i].percent.innerHTML = parseFloat(userStatsArray[i] * 100 / totalQuestions).toFixed(2)+ "%";
      }
    }
  }

  //detailed bar chart
  const detailedBarChart = document.getElementById("detailedBarChart");
  const detailedBarChartBars = detailedBarChart.children;

  var barChartController = [
    detailedBarChartBars[0].getElementsByTagName("div"), //correctPhish
    detailedBarChartBars[1].getElementsByTagName("div"), // correctAuth
    detailedBarChartBars[2].getElementsByTagName("div"), // missPhish
    detailedBarChartBars[3].getElementsByTagName("div") // missAuth
  ];

  function setBarChart(userStatsArray) {
    let max = Math.max(...userStatsArray);
    for (var i = 0; i < 4; i++) {
      barChartController[i][0].style.flexGrow = userStatsArray[i];
      barChartController[i][1].style.flexGrow = (max-userStatsArray[i]);
    }
  }

  // Set values
  document.getElementById('totalQuestionsHeader').innerHTML = totalQuestions;
  document.getElementById('correctHeader').innerHTML = (userStats[0] + userStats[1]);
  document.getElementById('incorrectHeader').innerHTML = (userStats[2] + userStats[3]);
  setTotalResult(userStats);
  setDetailedTable(userStats);
  setBarChart(userStats);
})();
