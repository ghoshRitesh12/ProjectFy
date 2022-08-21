import { $, $$, addGlobalEventListener } from './utility.js';

function validateEmail(e) {
  const value = e.target.value.trim();
  const invalid = { msg: '', error: false };

  if($('.signin__form__field--error') != null)
    $('.signin__form__field--error').style.display = "none";

  if(value.length <=0) {
    $('.client-validate--email').innerText = '';
    e.target.classList.remove('wrong-input');
    return;
  }

  const emailRegEx = /^(?:[a-zA-Z0-9-][\.\+]?)*@(?:[a-zA-Z0-9-]{2,})(?:\.[a-zA-Z0-9-]{2,})+$/;
  if(!emailRegEx.test(value)) {
    invalid.error = true;
    invalid.msg = 'Invalid email address, try another one';
  }

  e.target.classList.toggle('wrong-input', invalid.error);
  $('.client-validate--email').innerText = invalid.msg;

  validateEmail.err = false;
  if(invalid.error) 
    validateEmail.err = true;

}

function validatePwd(e) {
  const value = e.target.value.trim();
  const invalid = { msg: '', error: false };
  const minLength = 7, maxLength = 18;

  if($('.signin__form__field--error') != null)
    $('.signin__form__field--error').style.display = "none";

  if(value.length <= 0) {
    $('.signin__form__show-password').classList.remove('visible');
    $('.client-validate--pwd').innerText = '';
    e.target.classList.remove('wrong-input');
    return;
  }

  // value.length >= 1
  $('.signin__form__show-password').classList.add('visible');
  
  const pwdRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{7,18}$)/;
  if(!pwdRegEx.test(value)) {
    invalid.error = true;
    invalid.msg = 
    `Password must contain min ${minLength} to max ${maxLength} characters that include at least 1 lowercase, 1 UPPERCASE, 1 number and 1 special character among (!@#$%^&*)`;
  }
  
  e.target.classList.toggle('wrong-input', invalid.error);
  $('.client-validate--pwd').innerText = invalid.msg;

  
  validatePwd.err = false;
  if(invalid.error) 
    validatePwd.err = true;
}

// password validation
$('.signin__form__password').addEventListener('input', validatePwd);
// email validation
$('.signin__form__email').addEventListener('input', validateEmail);



$('.signin__form__show-password').addEventListener('click', e => {
  e.target.previousElementSibling.type = (e.target.previousElementSibling.type === "password") ? "text" : "password";

  if(e.target.classList.contains('showPwd'))
    e.target.classList.replace('showPwd', 'hidePwd');
  else
    e.target.classList.replace('hidePwd', 'showPwd');

  e.target.previousElementSibling.focus();
})


// server side validation error cross x
addGlobalEventListener(
  'click', 
  '.field_error-cross', 
  e => e.target.parentElement.style.display = "none"
)


$('.signin__form').addEventListener('submit', e => {
  if(validateEmail.err) return e.preventDefault();
  if(validatePwd.err) return e.preventDefault();
  
})
