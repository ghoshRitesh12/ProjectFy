import { $, $$, addGlobalEvL } from './utility.js';

console.log('app.js currently connected to signin page lol');

$.bruh = "XD";

console.log($);

window.addEventListener('load', e => {
  $('h1').style.color = "#00aeff";
  $('body').style.backgroundColor = "#222";
});


// const $ = a => document.querySelector(a);
// const $$ = bb => document.querySelectorAll(bb);



$('.signin__form__email').addEventListener('focus', e => {
  e.target.parentElement.classList.add('accent');
});

$('.signin__form__email').addEventListener('blur', e => {
  e.target.parentElement.classList.remove('accent');
});


$('.signin__form__password').addEventListener('focus', e => {
  e.target.parentElement.classList.add('accent');
});

$('.signin__form__password').addEventListener('blur', e => {
  e.target.parentElement.classList.remove('accent');
});


$('.signin__form__password').addEventListener('input', e => {

  if(e.target.value.length > 0)
    $('.signin__form__show-password').classList.add('visible');
  else
    $('.signin__form__show-password').classList.remove('visible');
})

$('.signin__form__show-password').addEventListener('click', e => {
  e.target.previousElementSibling.type = (e.target.previousElementSibling.type === "password") ? "text" : "password";
  e.target.textContent = (e.target.textContent === "hide") ? "show" : "hide";

  e.target.previousElementSibling.focus();
})