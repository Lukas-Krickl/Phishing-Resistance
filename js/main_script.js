"use strict";
const mobileNavContainer = document.getElementById('navLinks');

function toggleMobileNav(show) {
  mobileNavContainer.classList.toggle("nav-closed", !show);
}
