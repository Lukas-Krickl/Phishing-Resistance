"use strict";
const in_resistance_module = (function () {
  var webHints;
  var mailHints;
  const title = document.getElementById('header');
  const webHintBox = document.getElementById('webHintBox');
  const mailHintBox = document.getElementById('mailHintBox');

  function getJson() {
    let url = config.baseURL+config.hints_en;
    let http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.setRequestHeader("Accept", "application/json");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        storeJson(JSON.parse(http.responseText));

      } else if(http.status === 403 || http.status === 404) {
        console.error("Error while loading files: " + http.status);
      }
    }
  }

  function storeJson(parsedJson) {
    webHints = parsedJson.web;
    mailHints = parsedJson.mail;
    fillHints();
  }

  function fillHints() {
    // TODO: implement

  }

  function createHintItem() {
    // TODO: implement
  }

})();
