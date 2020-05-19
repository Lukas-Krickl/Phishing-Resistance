"use strict";
var resultModule = (function () {
  var viewTotalStats = true;
  const storage = storageControllerModule;
  storage.readRoundStats();
  const totalStats = storage.getTotalStats();
  const lastRoundNr = storage.getRoundStats().previous.length;
  var currentDisplayedRound = lastRoundNr;
  //DOM
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const viewTotal = document.getElementById('viewTotal');
  const viewRound = document.getElementById('viewRound');
  const heading = document.getElementById('heading');
  const statsHeading = document.getElementById('statsHeading');
  const statsHeadingCounter = statsHeading.getElementsByTagName('span');
  const correctHeader = document.getElementById('correctHeader');
  const incorrectHeader = document.getElementById('incorrectHeader');


  var totalQuestions = 0;
  for (var i = 0; i < totalStats.length; i++) {
    totalQuestions+=totalStats[i];
  }

  //total result bar
  var totalStatsController = {
    totalResults : document.getElementById('totalResults'),
    totalCorrect : totalResults.getElementsByTagName("div")[0],
    totalMiss : totalResults.getElementsByTagName("div")[1],
  };

  function setTotalResult(statsArray) {
    let correctPercent = 0;
    let incorrectPercent = 0;
    if (totalQuestions != 0) {
      correctPercent = ((statsArray[0] + statsArray[1]) * 100 / totalQuestions).toFixed(2);
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

  function setDetailedTable(statsArray) {
    for (var i = 0; i < tableEntries.length; i++) {
      tableEntries[i].amount.innerHTML = statsArray[i];
      if (totalQuestions ==0) {
        tableEntries[i].percent.innerHTML ="0.00%";
      } else {
        tableEntries[i].percent.innerHTML = parseFloat(statsArray[i] * 100 / totalQuestions).toFixed(2)+ "%";
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

  function setBarChart(statsArray) {
    let max = Math.max(...statsArray);
    for (var i = 0; i < 4; i++) {
      barChartController[i][0].style.flexGrow = statsArray[i];
      barChartController[i][1].style.flexGrow = (max-statsArray[i]);
    }
  }

  function displayTotalStats() {
    //manage buttons
    backBtn.classList.toggle('hidden', true);
    nextBtn.classList.toggle('hidden', true);
    viewTotal.classList.toggle('hidden', true);
    viewRound.classList.toggle('hidden', false);

    //headings
    heading.innerHTML = "Total Results";
    statsHeading.firstChild.nodeValue = "Questions answered: ";
    statsHeadingCounter.innerHTML = totalQuestions;
    correctHeader.innerHTML = (totalStats[0] + totalStats[1]);
    incorrectHeader.innerHTML = (totalStats[2] + totalStats[3]);

    // Set values
    setTotalResult(totalStats);
    setDetailedTable(totalStats);
    setBarChart(totalStats);
  }

  function displayRoundStats(round = lastRoundNr) {
    currentDisplayedRound = round;
    let roundStatsArray;
    //when never played, initialize empty array
    if(lastRoundNr === 0) {
      roundStatsArray = [0,0,0,0];
    } else {
      roundStatsArray = storage.getRoundStats().previous[round-1];
    }

    //manage buttons
    if (round < lastRoundNr) {
      backBtn.classList.toggle('hidden', false);
    }
    if (round > 1) {
      nextBtn.classList.toggle('hidden', false);
    }

    viewTotal.classList.toggle('hidden', false);
    viewRound.classList.toggle('hidden', true);

    //headings
    heading.innerHTML = "Round Results";
    statsHeading.firstChild.nodeValue = "Round: ";
    statsHeadingCounter.innerHTML = round;
    correctHeader.innerHTML = (roundStatsArray[0] + roundStatsArray[1]);
    incorrectHeader.innerHTML = (roundStatsArray[2] + roundStatsArray[3]);

    // Set values
    setTotalResult(roundStatsArray);
    setDetailedTable(roundStatsArray);
    setBarChart(roundStatsArray);
  }

  //btn event listeners
  backBtn.addEventListener("click", function () {
    displayRoundStats(currentDisplayedRound-1);
  });

  nextBtn.addEventListener("click", function () {
    displayRoundStats(currentDisplayedRound+1);
  });

  viewTotal.addEventListener("click", displayTotalStats);
  viewRound.addEventListener("click", displayRoundStats);



  displayTotalStats();
})();
