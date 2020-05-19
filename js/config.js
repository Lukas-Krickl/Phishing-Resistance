"use strict";

const config = {
  baseURL:"https://lukas-krickl.github.io/Phishing-Resistance/",
  files_en:{
    flaws:"data/flaws_en.json",
    authentic_mail:"data/questions/en/authentic_mail_en.json?a=2",
    authentic_web:"data/questions/en/authentic_web_en.json?a=2",
    phishing_mail:"data/questions/en/phishing_mail_en.json?a=2",
    phishing_web:"data/questions/en/phishing_web_en.json?a=2"
  },
  files_de:{
    flaws:"data/flaws_de.json",
    authentic_mail:"data/questions/de/authentic_mail_de.json",
    authentic_web:"data/questions/de/authentic_web_de.json",
    phishing_mail:"data/questions/de/phishing_mail_de.json",
    phishing_web:"data/questions/de/phishing_web_de.json"
  },
  question_text_en:{
    question:"Is this authentic or a phishing attack?",
    correctPhish:"Correct! It's phishing.",
    incorrectPhish:"Incorrect! You got phished.",
    correctAuth:"Correct! It's safe to use.",
    incorrectAuth:"Incorrect! It's safe to use."
  },
  question_text_de:{
    question:"Is this authentic or a phishing attack?",
    correctPhish:"Correct! It's phishing.",
    incorrectPhish:"Incorrect! You got phished.",
    correctAuth:"Correct! It's safe to use.",
    incorrectAuth:"Incorrect! It's safe to use."
  },
  hints_en:"data/hints_en.json"

};
