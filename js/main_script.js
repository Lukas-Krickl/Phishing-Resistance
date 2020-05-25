"use strict";
const mobileNavContainer = document.getElementById('navLinks');
const language = "EN";

document.getElementById('version').innerHTML = "v. 1.0.1 beta";

function toggleMobileNav(show) {
  mobileNavContainer.classList.toggle("nav-closed", !show);
}

window.addEventListener("load",function() {
    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);
});
