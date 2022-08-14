import { $, $$, addGlobalEvL } from './utility.js';

console.log('app.js currently connected to signin page lol');

$.bruh = "XD";

console.log($);


// const $ = a => document.querySelector(a);
// const $$ = bb => document.querySelectorAll(bb);



$('.signin__form__password').addEventListener('input', e => {

  if(e.target.value.length > 0)
    $('.signin__form__show-password').classList.add('visible');
  else
    $('.signin__form__show-password').classList.remove('visible');
})

$('.signin__form__show-password').addEventListener('click', e => {
  e.target.previousElementSibling.type = (e.target.previousElementSibling.type === "password") ? "text" : "password";

  if(e.target.classList.contains('showPwd'))
    e.target.classList.replace('showPwd', 'hidePwd');
  else
    e.target.classList.replace('hidePwd', 'showPwd');

  e.target.previousElementSibling.focus();
})

// window.addEventListener('load', e => {
//   $('.signin__form').reset();
// })

// $('.signin__form').addEventListener('submit', e => {
//   e.target.reset();
// })


addGlobalEvL('click', '.field_error-cross', e => {
  e.target.parentElement.style.display = "none";
  // e.target.parentElement.classList.remove('show-error');
})
