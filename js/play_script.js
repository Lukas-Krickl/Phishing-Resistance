"use strict";
var playModule = (function () {
  const controller = controllerModule;
  const firestore = firestore_controller_module;
  const storage = storageControllerModule;
  const sessionStore = window.sessionStorage;
  var switchToRoundResults = false;

  var data = {  //attributes used for automatic file loading, if changed, -> change loadData function
    flaws:"",
    authentic_mail:"",
    authentic_web:"",
    phishing_mail:"",
    phishing_web:""
  };

  const filePaths = (language === "DE") ? config.files_de : config.files_en;
  const fileNames = Object.getOwnPropertyNames(data);
  const fileCount = fileNames.length;

  var currentQuestion = {
    questionWrapper: {
      web:false,
      phishing:false,
      questionIndex: 0
    },
    answered:false,
    questionListIndex:-1
  };

  //read questionlist from session storage if user resumes session
  const resumeQuestions = sessionStore.getItem("questionListIndex");
  var questionList = [];
  if (resumeQuestions) {
    currentQuestion.questionListIndex = resumeQuestions;
    questionList = JSON.parse(sessionStore.getItem("questionList"));
    console.log("session restored:");
  }

  //firestore init
  //if User is not set in local storage request new
  if (!storage.readFireUser()) {
    firestore.newUserEntry(storage.storeNewFireUser);
  }


  //prepares first question
  function init() {
    if (!resumeQuestions) {
      shuffleQuestions(questionList)
    }
    selectNewQuestion();

    //show entry screen only if new user visits page
    controller.showEntryScreen(!resumeQuestions);
    displayQuestion();
    controller.questionController.questionBlock.classList.remove("hidden");
    controller.questionController.questionBlock.classList.add("slide-in-top");
    console.log("initialized");
  }

  function selectNewQuestion() {
    currentQuestion.answered = false;
    currentQuestion.questionListIndex++;
    //if all questions are processed reshuffle
    if (currentQuestion.questionListIndex == questionList.length) {
      console.log("all questions processed, reshuffling");
      currentQuestion.questionListIndex = 0;
      shuffleQuestions();
    }

    currentQuestion.questionWrapper.web = questionList[currentQuestion.questionListIndex].web;
    currentQuestion.questionWrapper.phishing = questionList[currentQuestion.questionListIndex].phishing;
    currentQuestion.questionWrapper.questionIndex = questionList[currentQuestion.questionListIndex].questionIndex;
    console.log("current question Nr: "+currentQuestion.questionListIndex);
  }

  //randomly selects any question
  function displayQuestion() {
    //question object from json file
    let question;

    //distinguish the type of question and display it correspondingly using the controller
    if (currentQuestion.questionWrapper.web) {
      //it's a web question
      if (currentQuestion.questionWrapper.phishing) {
        //it's a web phishing question
        question = data["phishing_web"][currentQuestion.questionWrapper.questionIndex];
        controller.questionController.displayWeb(question);
        fillHints(question);
      } else {
        //it's a web authentic question
        question = data["authentic_web"][currentQuestion.questionWrapper.questionIndex];
        controller.questionController.displayWeb(question);
      }
    } else {
      //it's a mail question
      if (currentQuestion.questionWrapper.phishing) {
        //it's a mail phishing question
        question = data["phishing_mail"][currentQuestion.questionWrapper.questionIndex];
        controller.questionController.displayMail(question);
        fillHints(question);
      } else {
        //it's a mail authentic question
        question = data["authentic_mail"][currentQuestion.questionWrapper.questionIndex];
        controller.questionController.displayMail(question);
      }
    }
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
      console.error("Could not display hints");
    }
  }

  function evaluateAnswer(answer) {
    if (!currentQuestion.answered) {
      currentQuestion.answered = true;

      if (currentQuestion.questionWrapper.phishing) {
        if(answer === "phishing") {
          storage.addResult("corrPhish");
          controller.gameController.toggleFeedback(true, true, true);
        } else {
          storage.addResult("missPhish");
          controller.gameController.toggleFeedback(true, false, true);
        }
        //display phishing hints
        controller.hintController.display(true);
      } else {
        if (answer === "authentic") {
          storage.addResult("corrAuth");
          controller.gameController.toggleFeedback(true, true, false);
        } else {
          storage.addResult("missAuth");
          controller.gameController.toggleFeedback(true, false, false);
        }
      }

      sessionStore.setItem("questionListIndex", currentQuestion.questionListIndex);
      firestore.updateStats(storage.getCurrentTestID(), storage.getRoundStats().current);
      if (storage.hasRoundEnded()) {
        storage.nextRound();
        firestore.newRound(storage.getFireUserID(), storage.storeCurrentTestID);
        switchToRoundResults = true;
      }

      console.log("stats after answer: "+JSON.stringify(storage.getRoundStats().current));
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
        console.error("Error while loading files: " + http.status);
      }
    }
  }

  //store given object in 'filename' variable of data object
  function storeJson(convertedJson, fileName) {
    data[fileName] = convertedJson;
    //set question amount
    if (!resumeQuestions) {
      addToQuestionList(fileName);
    }

    console.log(fileName + " successfully loaded");
    //travers all files in data, if all are loaded call init()
    for (let i = 0; i < fileCount; i++) {
      if(data[fileNames[i]] === ""){
        return;
      }
    }
    init();
  }

  //add all questions from the loaded data file into the question list
  function addToQuestionList(fileName) {
    switch (fileName) {
      case "authentic_mail" :
        for (let i = 0; i < data[fileName].length; i++) {
          let questionWrapper = {
            web:false,
            phishing:false,
            questionIndex: i
          }
          questionList.push(questionWrapper);
        }
        break;

      case "authentic_web" :
        for (let i = 0; i < data[fileName].length; i++) {
          let questionWrapper = {
            web:true,
            phishing:false,
            questionIndex: i
          }
          questionList.push(questionWrapper);
        }
        break;

      case "phishing_mail" :
        for (let i = 0; i < data[fileName].length; i++) {
          let questionWrapper = {
            web:false,
            phishing:true,
            questionIndex: i
          }
          questionList.push(questionWrapper);
        }
        break;

      case "phishing_web" :
        for (let i = 0; i < data[fileName].length; i++) {
          let questionWrapper = {
            web:true,
            phishing:true,
            questionIndex: i
          }
          questionList.push(questionWrapper);
        }
        break;
    }
  }

  //fisher yates shuffling algorithm
  function shuffleQuestions() {
    let i,j,k;
    for (i = questionList.length -1; i > 0; i--) {
      j = Math.floor(Math.random() * i)
      k = questionList[i]
      questionList[i] = questionList[j]
      questionList[j] = k
    }
    sessionStore.setItem("questionList", JSON.stringify(questionList));
  }

  //load data and start initialisation
  loadData();

  //web image expaded close btn event listener
  document.getElementById('expandedImgClose').addEventListener("click", function () {
    controller.expandedImgContainer.classList.add("hidden");
  });

  //web image expaded open btn event listener
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
  //wait until img is loaded, then show it
  controller.questionController.webSection.browserContentImg.addEventListener('load', function () {
    questionBlock.classList.remove("slide-out-top");
    questionBlock.classList.add("slide-in-top");
  });

  //next btn eventlistener
  controller.gameController.nextBTN.addEventListener("click", function () {
    //if round ended, nest btn directs to round result page
    if (switchToRoundResults) {
      //wait until slideout animation finished
      document.getElementById('body').classList.add("fade-out")
      setTimeout(function () {
        window.location.href="round_result.html";
      }, 800);
    }

    let questionBlock = controller.questionController.questionBlock;
    //hide hints
    controller.hintController.display(false);
    //reset feedback
    controller.gameController.toggleFeedback(false, false, false);
    //play exit css animation
    questionBlock.classList.remove("slide-in-top");
    questionBlock.classList.add("slide-out-top");

    //select new question
    selectNewQuestion();

    setTimeout(function () {
      //select and display new question after question slided out
      displayQuestion();
      //entrance animation for mail, web has eventlistener in controller
      if (controller.questionController.webSection.browserContentImg.complete
        && questionBlock.classList.contains("slide-out-top")) {
        questionBlock.classList.remove("slide-out-top");
        questionBlock.classList.add("slide-in-top");
      }
    }, 1200);
  });
})();
