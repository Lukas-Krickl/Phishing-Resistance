"use strict";
const in_resistance_module = (function () {
  var webHints;
  var mailHints;
  var interRoundHints;
  const header = document.getElementById('header');
  const webHintBox = document.getElementById('webHintBox');
  const mailHintBox = document.getElementById('mailHintBox');
  const webHintBtn = document.getElementById('webHintBtn');
  const mailHintBtn = document.getElementById('mailHintBtn');
  const nexRoundBtn = document.getElementById('nexRoundBtn');

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
    //fill web box with items
    let webFragment = document.createDocumentFragment();
    for (let i = 0; i < webHints.length; i++) {
      webFragment.appendChild(createHintItem(webHints[i]));
    }
    webHintBox.appendChild(webFragment);

    //fill mail box with items
    let mailFragment = document.createDocumentFragment();
    for (let i = 0; i < mailHints.length; i++) {
      mailFragment.appendChild(createHintItem(mailHints[i]));
    }
    mailHintBox.appendChild(mailFragment);
  }

  function createHintItem(hint) {
    let div = document.createElement("div");
    let h6 = document.createElement("h6");
    let p = document.createElement("p");
    let linkText = language === "DE" ? "(mehr Information)" : "(more information)";

    div.classList.add("hint-item");
    h6.innerHTML = hint.name;
    div.appendChild(h6);
    p.innerHTML = hint.description;
    div.appendChild(p);
    //if there is a link add it
    if (hint.link) {
      let a = document.createElement("a");
      a.setAttribute("href", hint.link);
      a.innerHTML = linkText;
      div.appendChild(a);
    }
    return div;
  }

  function findGetParameter(parameterName) {
    let result = null, tmp = [];
    let items = location.search.substr(1).split("&");
    for (let index = 0; index < items.length; index++) {
      tmp = items[index].split("=");
      if (tmp[0] === parameterName) {
        result = tmp[1];
      }
    }
    return result;
  }


  mailHintBtn.addEventListener("click", function () {
    //change content
    webHintBox.classList.toggle("hidden", true);
    mailHintBox.classList.toggle("hidden", false);
    //change buttons
    webHintBtn.classList.toggle("hidden", false);
    mailHintBtn.classList.toggle("hidden", true);
    //change header
    header.innerHTML = "Improve your Phishing Resistance in E-Mails";
  });

  webHintBtn.addEventListener("click", function () {
    //change content
    webHintBox.classList.toggle("hidden", false);
    mailHintBox.classList.toggle("hidden", true);
    //change buttons
    webHintBtn.classList.toggle("hidden", true);
    mailHintBtn.classList.toggle("hidden", false);
    //change header
    header.innerHTML = "Improve your Phishing Resistance on websites";
  });

  interRoundHints = findGetParameter("roundHints");
  if (interRoundHints === "true") {
    nexRoundBtn.classList.toggle("hidden", false);
  }

  getJson();
})();
