# Phishing-Resistance
Phishing resistance is a website for practising the identification of phising e-mails and websites.
It makes use of github pages hosting so all backendlogic has to be done by the browser.


### Backend Logic
All data is stored in jsons.

#### Files
A "questions.json" contains metainformation all webpages and e-mails
+ **type** - "web"/"mail"
+ **phishing** - true/false
+ **

```json
[{
  "type":"web",
  ""
  "phishing":true,
  "hints":[0,2,5],
  "filename":"path/file.ending",

},

]
```

```json
[{
  "url":"https://someurl",
  "phishing":true,
  "hints":[0,2,5],
  "filename":"path/file.ending",

},

]
```
