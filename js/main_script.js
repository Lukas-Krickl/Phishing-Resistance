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
