"use strict";
const controllerModule = (function () {

  //controller for controlling hints section on page
  const hintController = {
    hintBox : document.getElementById('hintBox'),
    hintList : document.getElementById('hintList'),

    //takes array with flaws objects and apends to ul
    setHints : function (hints) {
      this.hintList.innerHTML = "";
      let fragment = document.createDocumentFragment();
      for (let i = 0; i < hints.length; i++) {
        fragment.appendChild(createHintListItem(hints[i]));
      }
      this.hintList.appendChild(fragment);
    },

    createHintListItem : function (hint) {
      let li = document.createElement("li");
      let h6 = document.createElement("h6");
      let p = document.createElement("p");
      let linkText = language === "DE" ? "(mehr Information)" : "(more information)";

      h6.innerHTML = hint.title;
      li.appendChild(h6);
      p.innerHTML = hint.description;
      li.appendChild(p);
      //if there is a link add it
      if (hint.link) {
        let a = document.createElement("a");
        a.setAttribute("href", hint.link);
        a.innerHTML = linkText;
        li.appendChild(a);
      }
      return li;
    },

    display : function (show) {
      this.hintBox.classList.toggle("hidden", !show);
    }
  };

  //controller for the question section
  const questionController = {
    webSection : {
      webBlock : document.getElementById('webBlock'),
      browserLock : document.getElementById('browserLock'),
      browserUrl : document.getElementById('browserUrl'),
      browserContent : document.getElementById('browserContent')
    },

    mailSection : {
      mailBlock : document.getElementById('mailBlock'),
      mailHeader : document.getElementById('mailHeader'),
      mailContent : document.getElementById('mailContent'),
      fromText : language === "DE" ? "Absender" : "From",
      subjectText : language === "DE" ? "Betreff" : "Subject"
    },

    displayWeb: function (webJson) {
      this.webSection.webBlock.classList.toggle("hidden", false);
      this.mailSection.mailBlock.classList.toggle("hidden", true);

      //set ssl lock
      if (webJson.ssl) {
        this.webSection.browserLock.src = "../../assets/icons/lock-closed.svg";
      } else {
        this.webSection.browserLock.src = "../../assets/icons/lock-open.svg";
      }

      //set browser url
      this.webSection.browserUrl.innerHTML = webJson.url;

      //set browser content
      this.webSection.browserContent.src = webJson.file;
    },

    displayMail: function (mailJson) {
      this.mailSection.mailBlock.classList.toggle("hidden", false);
      this.webSection.webBlock.classList.toggle("hidden", true);

      let fragment = document.createDocumentFragment();
      let fromHeader = document.createElement("h5");
      let fromContent = document.createElement("span");
      let subjectHeader = document.createElement("h5");
      let subjectContent = document.createElement("span");

      fromHeader.innerHTML = this.mailSection.fromText;
      fromContent.innerHTML = mailJson.from;
      subjectHeader.innerHTML = this.mailSection.subjectText;
      subjectContent.innerHTML = mailJson.subject;
      fragment.appendChild(fromHeader);
      fragment.appendChild(fromContent);
      fragment.appendChild(subjectHeader);
      fragment.appendChild(subjectContent);

      this.mailSection.mailHeader.innerHTML = "";
      this.mailSection.mailHeader.appendChild(fragment);
      this.mailSection.mailContent.innerHTML = mailJson.content;
    }
  };

  var gameController = {
    authenticBTN : document.getElementById('authenticBTN'),
    phishingBTN : document.getElementById('phishingBTN'),
    nextBTN : document.getElementById('nextBTN'),
    resultFeedback: document.getElementById('resultFeedback'),
    feedbackTextCorrect : language === "DE" ? "Richtig!" : "Correct!",
    feedbackTextIncorrect : language === "DE" ? "Falsch!" : "Incorrect!",

    toggleFeedback : function (show=false, correct, phishing) {
      if (show) {
        if (correct) {
          this.resultFeedback.classList.toggle("correct", true);
          this.resultFeedback.classList.toggle("incorrect", false);
          this.resultFeedback.innerHTML = this.feedbackTextCorrect;
          this.resultFeedback.classList.toggle("hidden", false);

        } else {
          this.resultFeedback.classList.toggle("incorrect", true);
          this.resultFeedback.classList.toggle("correct", false);
          this.resultFeedback.innerHTML = this.feedbackTextIncorrect;
          this.resultFeedback.classList.toggle("hidden", false);
        }

        if (phishing) {
          this.phishingBTN.disabled = true;
          this.authenticBTN.classList.toggle("hidden", true);
        } else {
          this.authenticBTN.disabled = true;
          this.phishingBTN.classList.toggle("hidden", true);
        }
        this.nextBTN.classList.toggle("hidden", false);

      } else {
        //enable disabled btns hide feedback and next btn
        this.resultFeedback.classList.toggle("hidden", true);
        this.nextBTN.classList.toggle("hidden", true);
        this.phishingBTN.disabled = false;
        this.phishingBTN.classList.toggle("hidden", false);
        this.authenticBTN.disabled = false;
        this.authenticBTN.classList.toggle("hidden", false);
      }
    }
  };

  return {
    hintController:hintController,
    questionController:questionController,
    gameController : gameController
  }
})();
