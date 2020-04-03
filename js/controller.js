"use strict";
const controllerModule = (function () {

  //controller for controlling hints section on page
  const hintController = {
    hintBox : document.getElementById('hintBox'),
    hintList : document.getElementById('hintList'),

    //takes array with flaws objects and apends to ul
    addHints : function (hints) {
      let fragment = document.createDocumentFragment();
      let length = hints.length;
      for (let i = 0; i < length; i++) {
        fragment.appendChild(createHintListItem(hints[i]));
      }
      hints.appendChild(fragment);
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
      hintBox.hidden = !show;
    },

    clear : function () {
      hintList.innerHTML = "";
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
      webSection.webBlock.classList.toggle(hidden, false);
      mailSection.mailBlock.classList.toggle(hidden, true);

      //set ssl lock
      if (webJson.ssl) {
        webSection.browserLock.src = "../../assets/icons/lock-closed.svg";
      } else {
        webSection.browserLock.src = "../../assets/icons/lock-open.svg";
      }

      //set browser url
      webSection.browserUrl.innerHTML = webJson.url;

      //set browser content
      webSection.browserContent.src = webJson.file;
    },

    displayMail: function (mailJson) {
      mailSection.mailBlock.classList.toggle(hidden, false);
      webSection.webBlock.classList.toggle(hidden, true);

      let fragment = document.createDocumentFragment();
      let fromHeader = document.createElement("h5");
      let fromContent = document.createElement("span");
      let subjectHeader = document.createElement("h5");
      let subjectContent = document.createElement("span");

      fromHeader.innerHTML = mailSection.fromText;
      fromContent.innerHTML = mailJson.from;
      subjectHeader.innerHTML = mailSection.subjectText;
      subjectContent.innerHTML = mailJson.subject;
      fragment.appendChild(fromHeader);
      fragment.appendChild(fromContent);
      fragment.appendChild(subjectHeader);
      fragment.appendChild(subjectContent);

      mailSection.mailHeader.innerHTML = fragment; //test if this works
      mailSection.mailContent.innerHTML = mailJson.content;
    }

  };

  return {
    hintController:hintController,
    questionController:questionController
  }
})();
