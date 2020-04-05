"use strict";
var playModule = (function () {
  const controller = controllerModule;
  var data = {
    flaws:"",
    authentic_mail:"",
    authentic_web:"",
    phishing_mail:"",
    phishing_web:""
  };

  //cookie is a array with amount [correct phish, correct auth, missed phish, missed auth]
  var userStats;
  if (document.cookie) {
    userStats = JSON.parse(document.cookie);
    console.log("exisiting user: "+document.cookie);
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

  function errorScreen(reason) {
    // TODO: for testing until error screen exists
    console.log("ERROR SCREEN PRINTS: "+ reason);
  }

  //prepares first question
  function init() {
    let entryScreen = document.getElementById('entryScreen');
    setTimeout(function () {
      entryScreen.classList.add("invisible");
      //select and display new question after question slided out
    }, 2000);
    setTimeout(function () {
      entryScreen.classList.add("hidden");
      //select and display new question after question slided out
    }, 3000);
    selectQuestion();
    console.log("initialized");



  }

  //randomly selects any question
  function selectQuestion() {
    let question;
    //select web or mail
    currentQuestion.web = (Math.random()<0.5);
    //select phishing or authentic
    currentQuestion.phishing = (Math.random()<0.5);
    //get question from file
    if (currentQuestion.web) {
      if (currentQuestion.phishing) {
        //web phishing
        question = data.phishing_web[getRandomIndex(data.phishing_web.length)];
        controller.questionController.displayWeb(question);
        console.log("selected question: "+JSON.stringify(question));
        fillHints(question);
      } else {
        //web authentic
        question = data.authentic_web[getRandomIndex(data.authentic_web.length)];
        controller.questionController.displayWeb(question);
        console.log("selected question: "+JSON.stringify(question));
      }
    } else {
      if (currentQuestion.phishing) {
        //mail phishing
        question = data.phishing_mail[getRandomIndex(data.phishing_mail.length)];
        controller.questionController.displayMail(question);
        console.log("selected question: "+JSON.stringify(question));
        fillHints(question);
      } else {
        //mail authentic
        question = data.authentic_mail[getRandomIndex(data.authentic_mail.length)];
        controller.questionController.displayMail(question);
        console.log("selected question: "+JSON.stringify(question));
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
      console.log("show hints of question: "+JSON.stringify(question));
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
      document.cookie = JSON.stringify(userStats);
      //show result feedback and hints
      console.log("stats after answer: "+document.cookie);
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
    console.log(fileName + " successfully loaded");
    //travers all files in data, if all are loaded call init()
    for (let i = 0; i < fileCount; i++) {
      if(data[fileNames[i]] === ""){
        return;
      }
    }
    init();
  }

  //load data and start initialisation
  loadData();

  // phishing btn event listener
  controller.gameController.phishingBTN.addEventListener("click", function () {
    evaluateAnswer("phishing");
    //for css animation
    controller.questionController.questionBlock.classList.remove("slide-in-top");
  });

  // authentic btn eventlistener
  controller.gameController.authenticBTN.addEventListener("click", function () {
    evaluateAnswer("authentic");
    //for css animation
    controller.questionController.questionBlock.classList.remove("slide-in-top");
  });

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
    questionBlock.classList.add("slide-out-top");
    setTimeout(function () {
      questionBlock.classList.remove("slide-out-top");
      //select and display new question after question slided out
      selectQuestion();
    }, 1200);

    //play entrance css animation
    questionBlock.classList.add("slide-in-top");
  });
})();
