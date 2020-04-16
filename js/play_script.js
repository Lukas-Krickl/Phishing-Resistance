"use strict";
var playModule = (function () {
  const controller = controllerModule;
  var data = {  //attributes used for automatic file loading, if changed, -> change loadData function
    flaws:"",
    authentic_mail:"",
    authentic_web:"",
    phishing_mail:"",
    phishing_web:""
  };

  // rates are calculated relative to subgroup eg phishingRate + authenticRate =1
  var questionDistribution = {
    total: 0,
    web: {
      webRate: 0.5,
      phishing: 0,
      phishingRate: 0.5,
      authentic:0,
      authenticRate:0.5
    },
    mail : {
      mailRate: 0.5,
      phishing: 0,
      phishingRate: 0.5,
      authentic:0,
      authenticRate:0.5
    }
  }

  //userStats is a array with amount [correct phish, correct auth, missed phish, missed auth]
  var userStats = getUserStats(); //is a string
  if (userStats) {
    try {
      console.log("exisiting user: "+userStats);
      userStats = JSON.parse(userStats);
    } catch (e) {
      console.log("error on parsing userstats: "+JSON.stringify(e));
      userStats = [0,0,0,0];
    }
  } else {
    userStats = [0,0,0,0];
    console.log("new user initialized");
  }

  const filePaths = (language === "DE") ? config.files_de : config.files_en;
  const fileNames = Object.getOwnPropertyNames(data);
  const fileCount = fileNames.length;

  var currentQuestion = {
    web:false,
    phishing:false,
    answered:false
  };

  function calcQuestionDistribution() {
    questionDistribution.web.phishingRate = (questionDistribution.web.phishing / (questionDistribution.web.phishing + questionDistribution.web.authentic)).toFixed(2);
    questionDistribution.web.authenticRate = (1 - questionDistribution.web.phishingRate).toFixed(2);
    questionDistribution.mail.phishingRate = (questionDistribution.mail.phishing / (questionDistribution.mail.phishing + questionDistribution.mail.authentic)).toFixed(2);
    questionDistribution.mail.authenticRate = (1 - questionDistribution.mail.phishingRate).toFixed(2);
    questionDistribution.web.webRate = ((questionDistribution.web.phishing + questionDistribution.web.authentic) / questionDistribution.total).toFixed(2);
    questionDistribution.mail.mailRate = (1-questionDistribution.web.webRate).toFixed(2);
    console.log("question distribution: "+JSON.stringify(questionDistribution));
  }

  function errorScreen(reason) {
    // TODO: for testing until error screen exists
    console.log("ERROR SCREEN PRINTS: "+ reason);
  }

  //prepares first question
  function init() {
    calcQuestionDistribution();
    //show entry screen only if new user visits page
    controller.showEntryScreen(userStats===[0,0,0,0]);
    selectQuestion();
    controller.questionController.questionBlock.classList.replace("hidden", "slide-in-top");
    console.log("initialized");
  }

  //randomly selects any question
  function selectQuestion() {
    let question;
    //randomly select web or mail based on distribution
    currentQuestion.web = (Math.random() < questionDistribution.web.webRate);

    if (currentQuestion.web) {
      //randomly select phish or auth based on distribution
      currentQuestion.phishing = (Math.random() < questionDistribution.web.phishingRate);
      if (currentQuestion.phishing) {
        //web phishing
        question = data.phishing_web[getRandomIndex(data.phishing_web.length)];
        controller.questionController.displayWeb(question);
        fillHints(question);
      } else {
        //web authentic
        question = data.authentic_web[getRandomIndex(data.authentic_web.length)];
        controller.questionController.displayWeb(question);
      }
    } else {
      //its mail
      //randomly select phish or auth based on distribution
      currentQuestion.phishing = (Math.random() < questionDistribution.mail.phishingRate);
      if (currentQuestion.phishing) {
        //mail phishing
        question = data.phishing_mail[getRandomIndex(data.phishing_mail.length)];
        controller.questionController.displayMail(question);
        fillHints(question);
      } else {
        //mail authentic
        question = data.authentic_mail[getRandomIndex(data.authentic_mail.length)];
        controller.questionController.displayMail(question);
      }
    }
  }

  function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  //selects all flaws mentioned in the question and fill hints box
  function fillHints(question) {
    if (question.hasOwnProperty("flaws")) {
      let hints = [];
      for (var i = 0; i < question.flaws.length; i++) {
        hints.push(data.flaws[question.flaws[i]]);
      }
      controller.hintController.setHints(hints);
    } else {
      errorScreen("Could not display hints code: pl87");
    }
  }

  function evaluateAnswer(answer) {
    if (!currentQuestion.answered) {
      currentQuestion.answered = true;

      if (currentQuestion.phishing) {
        if(answer === "phishing") {
          console.log("answered phishing on phishing");
          userStats[0]++;
          controller.gameController.toggleFeedback(true, true, true);
        } else {
          userStats[2]++;
          controller.gameController.toggleFeedback(true, false, true);
        }
        controller.hintController.display(true);
      } else {
        if (answer === "authentic") {
          userStats[1]++;
          controller.gameController.toggleFeedback(true, true, false);
        } else {
          userStats[3]++;
          controller.gameController.toggleFeedback(true, false, false);
        }
      }
      setUserStats(userStats);
      //show result feedback and hints
      console.log("stats after answer: "+JSON.stringify(userStats));
    }
  }

  //load all jsons into data object and call init
  function loadData() {
    for (let i = 0; i < fileCount; i++) {
      getJson(config.baseURL + filePaths[fileNames[i]], fileNames[i]);
    }
  }

  //request a json and store it into data
  function getJson(url, fileName) {
    let http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.setRequestHeader("Accept", "application/json");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        storeJson(JSON.parse(http.responseText), fileName);

      } else if(http.status === 403 || http.status === 404) {
        errorScreen("Error while loading files: " + http.status);
      }
    }
  }

  //store given object in 'filename' variable of data object
  function storeJson(convertedJson, fileName) {
    data[fileName] = convertedJson;
    //set question amount
    setquestionDistribution(fileName);

    console.log(fileName + " successfully loaded");
    //travers all files in data, if all are loaded call init()
    for (let i = 0; i < fileCount; i++) {
      if(data[fileNames[i]] === ""){
        return;
      }
    }
    init();
  }

  function setquestionDistribution(fileName) {
    switch (fileName) {
      case "authentic_mail" :
        questionDistribution.mail.authentic = data[fileName].length;
        questionDistribution.total += questionDistribution.mail.authentic;
        break;

      case "authentic_web" :
        questionDistribution.web.authentic = data[fileName].length;
        questionDistribution.total += questionDistribution.web.authentic;
        break;

      case "phishing_mail" :
        questionDistribution.mail.phishing = data[fileName].length;
        questionDistribution.total += questionDistribution.mail.phishing;
        break;

      case "phishing_web" :
        questionDistribution.web.phishing = data[fileName].length;
        questionDistribution.total += questionDistribution.web.phishing;
        break;
    }
  }

  //load data and start initialisation
  loadData();


  document.getElementById('expandedImgClose').addEventListener("click", function () {
    controller.expandedImgContainer.classList.add("hidden");
  });

  controller.questionController.webSection.browserContentImg.addEventListener("click", function () {
    controller.expandedImgContainer.classList.remove("hidden");
  });

  // phishing btn event listener
  controller.gameController.phishingBTN.addEventListener("click", function () {
    evaluateAnswer("phishing");
  });

  // authentic btn eventlistener
  controller.gameController.authenticBTN.addEventListener("click", function () {
    evaluateAnswer("authentic");
  });

  //browser img load eventlistener for slide in animation
  controller.questionController.webSection.browserContentImg.addEventListener('load', function () {
    questionBlock.classList.replace("slide-out-top", "slide-in-top");
  })

  //next btn eventlistener
  controller.gameController.nextBTN.addEventListener("click", function () {
    let questionBlock = controller.questionController.questionBlock;
    //hide hints
    controller.hintController.display(false);
    //reset feedback
    controller.gameController.toggleFeedback(false, false, false);
    //reset question answer
    currentQuestion.answered = false;
    //play exit css animation
    questionBlock.classList.replace("slide-in-top","slide-out-top");
    setTimeout(function () {
      //select and display new question after question slided out
      selectQuestion();
      if(controller.questionController.webSection.browserContentImg.complete) {
        questionBlock.classList.replace("slide-out-top", "slide-in-top");
      }
    }, 1200);
  });
})();
