"use strict";
const mobileNavContainer = document.getElementById('navLinks');

function toggleMobileNav(show) {
  mobileNavContainer.classList.toggle("nav-closed", !show);
}

window.addEventListener("load",function() {
    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);
});



//// statistics management

function setUserStats(userStats) {
  var d = new Date();
  d.setTime(d.getTime() + (80*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = "userStats=" + JSON.stringify(userStats) + ";" + expires + ";path=/";
}


function getUserStats() {
  var name = "userStats=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
