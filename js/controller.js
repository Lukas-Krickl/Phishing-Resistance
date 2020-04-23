"use strict";
const controllerModule = (function () {
  const expandedImgContainer = document.getElementById('expandedImgContainer');
  const finishScreen = document.getElementById('finishScreen');

  //controll the entry screen
  function showEntryScreen(show) {
    let entryScreen = document.getElementById('entryScreen');
    if (show) {
      //fade out
      setTimeout(function () {
        entryScreen.classList.add("invisible");
      }, 2500);
      //hide completely
      setTimeout(function () {
        entryScreen.remove();
      }, 3000);
    } else {
      entryScreen.classList.add("invisible");
      setTimeout(function () {
        entryScreen.remove();
      }, 2000);
    }
  }

  //controller for controlling hints section on page
  const hintController = {
    hintBox : document.getElementById('hintBox'),
    hintList : document.getElementById('hintList'),

    //takes array with flaws objects and apends to ul
    setHints : function (hints) {
      this.hintList.innerHTML = "";
      let fragment = document.createDocumentFragment();
      for (let i = 0; i < hints.length; i++) {
        fragment.appendChild(this.createHintListItem(hints[i]));
      }
      this.hintList.appendChild(fragment);
    },

    createHintListItem : function (hint) {
      let li = document.createElement("li");
      let h6 = document.createElement("h6");
      let p = document.createElement("p");
      let linkText = language === "DE" ? "(mehr Information)" : "(more information)";

      h6.innerHTML = hint.name;
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
      if (show) {
        this.hintBox.classList.remove("slide-out-top", "hint-hidden");
        setTimeout(function () {
          this.hintBox.classList.remove("hint-text-hidden");
        }, 1100);
      } else {
        this.hintBox.classList.add("slide-out-top", "hint-text-hidden", "hint-hidden");
      }
    }
  };

  //controller for the question section
  const questionController = {
    questionBlock: document.getElementById('questionBlock'),
    webSection : {
      webBlock : document.getElementById('webBlock'),
      browserLock : document.getElementById('browserLock'),
      browserUrl : document.getElementById('browserUrl'),
      browserContentImg: document.getElementById('browserContentImg'),
      expandedImgIframe : document.getElementById('expandedImgIframe'),
    },

    mailSection : {
      mailBlock : document.getElementById('mailBlock'),
      mailHeader : document.getElementById('mailHeader'),
      mailContent : document.getElementById('mailContent'),
      fromText : language === "DE" ? "Absender:" : "From:",
      subjectText : language === "DE" ? "Betreff:" : "Subject:"
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
      this.webSection.browserContentImg.src = webJson.file;
      this.webSection.expandedImgIframe.src = webJson.file;
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
    questionTitle: document.getElementById('questionTitle'),
    text : {
      question: language === "DE" ? config.question_text_de.question : config.question_text_en.question,
      correctPhish: language === "DE" ? config.question_text_de.correctPhish : config.question_text_en.correctPhish,
      incorrectPhish: language === "DE" ? config.question_text_de.incorrectPhish : config.question_text_en.incorrectPhish,
      correctAuth: language === "DE" ? config.question_text_de.correctAuth : config.question_text_en.correctAuth,
      incorrectAuth: language === "DE" ? config.question_text_de.incorrectAuth : config.question_text_en.incorrectAuth
    },

    toggleFeedback : function (show=false, correct, phishing) {
      if (show) {
        if (phishing) {
          if (correct) {
            //phishing and correct
            this.questionTitle.innerHTML = this.text.correctPhish;
            this.questionTitle.classList.add("correct", "text-focus-in");

          } else {
            //phishing and incorrect
            this.questionTitle.innerHTML = this.text.incorrectPhish;
            this.questionTitle.classList.add("incorrect", "text-focus-in");
          }
          //mark wrong btn
          this.authenticBTN.classList.add("btn-wrong");
        } else {
          if (correct) {
            //authentic and correct
            this.questionTitle.innerHTML = this.text.correctAuth;
            this.questionTitle.classList.add("correct", "text-focus-in");

          } else {
            //authentic and incorrect
            this.questionTitle.innerHTML = this.text.incorrectAuth;
            this.questionTitle.classList.add("incorrect", "text-focus-in");
          }
          //mark wrong btn
          this.phishingBTN.classList.toggle("btn-wrong", true);
        }
        //show next button
        this.phishingBTN.disabled = true;
        this.authenticBTN.disabled = true;
        this.nextBTN.disabled = false;
        this.nextBTN.classList.toggle("invisible", false);

      } else {
        //enable disabled btns hide, feedback and next btn

        this.questionTitle.classList.replace("text-focus-in", "text-blur-out")
        setTimeout(function () {
          gameController.questionTitle.classList.remove("incorrect", "correct");
          gameController.questionTitle.innerHTML = gameController.text.question;
          gameController.nextBTN.classList.add("invisible");
          gameController.nextBTN.disabled = true;
          gameController.phishingBTN.disabled = false;
          gameController.phishingBTN.classList.remove("btn-wrong");
          gameController.authenticBTN.disabled = false;
          gameController.authenticBTN.classList.remove("btn-wrong");
          //fade in animation
          gameController.questionTitle.classList.replace("text-blur-out", "text-focus-in");
        }, 1000); //delay = time of text blur out animation

      }
    }
  };

  //expand img event listener

  return {
    expandedImgContainer:expandedImgContainer,
    finishScreen:finishScreen,
    toggleMobileNav:toggleMobileNav,
    showEntryScreen:showEntryScreen,
    hintController:hintController,
    questionController:questionController,
    gameController : gameController
  }
})();
