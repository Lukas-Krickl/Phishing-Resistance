"use strict";
const roundResultsModule = (function () {
  const storage = storageControllerModule;
  storage.readRoundStats();
  const roundStats = storage.readRoundStats();
  const lastRoundNumber = roundStats.previous.length;
  const lastRoundStats = roundStats.previous[lastRoundNumber-1];
  const totalQuestions = 15;

  var totalStatsController = {
    totalResultBar : document.getElementById('totalResultBar'),
    totalCorrect : totalResultBar.getElementsByTagName("div")[0],
    totalMiss : totalResultBar.getElementsByTagName("div")[1],
  };

  function setTotalResult(roundStatsArray) {
    let correctPercent = 0;
    let incorrectPercent = 0;
    if (totalQuestions != 0) {
      correctPercent = ((roundStatsArray[0] + roundStatsArray[1]) * 100 / totalQuestions).toFixed(2);
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

  function setDetailedTable(roundStatsArray) {
    for (var i = 0; i < tableEntries.length; i++) {
      tableEntries[i].amount.innerHTML = roundStatsArray[i];
      if (totalQuestions ==0) {
        tableEntries[i].percent.innerHTML ="0.00%";
      } else {
        tableEntries[i].percent.innerHTML = parseFloat(roundStatsArray[i] * 100 / totalQuestions).toFixed(2)+ "%";
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

  function setBarChart(roundStatsArray) {
    let max = Math.max(...roundStatsArray);
    for (var i = 0; i < 4; i++) {
      barChartController[i][0].style.flexGrow = roundStatsArray[i];
      barChartController[i][1].style.flexGrow = (max-roundStatsArray[i]);
    }
  }

  // Set values
  document.getElementById('roundNumber').innerHTML = lastRoundNumber;
  document.getElementById('correctHeader').innerHTML = (lastRoundStats[0] + lastRoundStats[1]);
  document.getElementById('incorrectHeader').innerHTML = (lastRoundStats[2] + lastRoundStats[3]);
  setTotalResult(lastRoundStats);
  setDetailedTable(lastRoundStats);
  setBarChart(lastRoundStats);

})();
