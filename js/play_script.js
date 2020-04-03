"use strict";
var playModule = (function () {
  const http = new XMLHttpRequest();
  var data = {
    flaws:"",
    authentic_mail:"",
    authentic_web:"",
    phishing_mail:"",
    phishing_web:""
  };

  const filenames = Object.getOwnPropertyNames(data);

  var currentQuestion = {
    phishing:false,
    web:false
  };

  //prepares first question
  function init() {
    alert("initialized");
  }

  //load jsons into data object
  function loadData() {
    let filePaths = (language === "DE") ? config.files_de : config.files_en;

    let length = filenames.length;
    for (var i = 0; i < length; i++) {
      getJson(config.baseURL + filePaths[filenames[i]], filenames[i]);
    }
    console.log("all jsons requested");
  }

  //a function requesting a json and passing it to callback
  function getJson(url, filename) {
    http.open("GET", url, true);
    http.setRequestHeader("Accept", "application/json");
    http.send();
    console.log("Requested: ", url);
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        storeJson(filename, JSON.parse(http.responseText));
      } else {
        console.log("Error on loading json " + url + " " + http.status);
        errorScreen("Files could not be loaded: " + http.status)
      }
    }
  }

  function storeJson(filename, convertedJson) {
    data[filename] = convertedJson;
    console.log(dataPropertyName + " loaded Successfully");
    console.log(data);
    //travers all files in data, if all are loaded call init()
    for (let file in filenames) {
      if (data[file] === "") {
        return;
      }
    }
    init();
  }

  function errorScreen(reason) {
    // TODO: for testing until error screen exists
    alert(reason);
  }






  loadData();
})();
