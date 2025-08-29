document.addEventListener("DOMContentLoaded", () => {
const accBtn = document.querySelector(".account-circle");
const  float = document.querySelector(".account-floating-bar");
const drkBtn = document.querySelector(".dark-button");
const drkTxt = document.querySelector(".dark-mode-text");
const drkimg = document.querySelector(".dark-mode-image");
const mobSideBar = document.querySelector(".mobile-user-bar");
const btnSidebar = document.querySelector(".button-sidebar");
const mbDrkBtn = document.querySelector(".mob-dark-btn");
const mbDrkImg = document.querySelector(".mob-dark-img");
const mbDrkTxt = document.querySelector(".mob-dark-txt");


accBtn.addEventListener("click", () => {
  float.classList.toggle("hidden");
});

// drkBtn.addEventListener("click", () => {
//   document.documentElement.classList.toggle("dark");

//   if(document.documentElement.classList.contains("dark")) {
//     drkTxt.textContent = "Light Mode";
//     drkimg.src = "./images/light_mode.svg"
//   }
//   else {
//     drkTxt.textContent = "Dark Mode";
//     drkimg.src = "./images/dark_mode.svg"
//   }

// })

drkBtn.addEventListener("click", () => {darkFucntion()});
mbDrkBtn.addEventListener("click", () => {darkFucntion()});

function darkFucntion() {

  document.documentElement.classList.toggle("dark");

  if(document.documentElement.classList.contains("dark")) {
     drkTxt.textContent = "Light Mode";
     drkimg.src = "./images/light_mode.svg"
     mbDrkTxt.textContent = "Light Mode";
     mbDrkImg.src = "./images/light_mode.svg"
   }
   else {
     drkTxt.textContent = "Dark Mode";
     drkimg.src = "./images/dark_mode.svg"
     mbDrkTxt.textContent = "Dark Mode";
     mbDrkImg.src = "./images/dark_mode.svg"
  }
}
});
