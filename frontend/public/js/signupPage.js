import { $, $$, addGlobalEventListener } from './utility.js';

// functions
const validateEmail = e => {
  const value = e.target.value.trim();
  const invalid = { msg: '', error: false };

  if($('.signin__form__field--error') != null)
    $('.signin__form__field--error').style.display = "none";

  if(value.length <=0) {
    $('.client-validate--email').innerText = '';
    e.target.classList.remove('wrong-input');
    return;
  }

  // const emailRegEx = /^(?:[a-zA-Z0-9-][\.\+]?)*@(?:[a-zA-Z0-9-]{2,})(?:\.[a-zA-Z0-9-]{2,})+$/;
  const emailRegEx = /(?:[a-zA-Z0-9]{3,})(?:[\.\+]?[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]{2,})(?:\.[a-zA-Z0-9]{2,})+$/;
  if(!emailRegEx.test(value)) {
    invalid.error = true;
    invalid.msg = 'Email address is invalid';
  }

  e.target.classList.toggle('wrong-input', invalid.error);
  $('.client-validate--email').innerText = invalid.msg;

  validateEmail.err = false;
  if(invalid.error) 
    validateEmail.err = true;
}

const validatePwd = e => {
  const value = e.target.value.trim();
  const invalid = { msg: '', error: false };
  const minLength = 8, maxLength = 16;

  if($('.signin__form__field--error') != null)
    $('.signin__form__field--error').style.display = "none";

  if(value.length <= 0) {
    $('.client-validate--pwd').innerText = '';
    e.target.classList.remove('wrong-input');
    return;
  }

  // value.length >= 1  
  const pwdRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16}$)/;
  if(!pwdRegEx.test(value)) {
    invalid.error = true;
    invalid.msg = 
    `Use ${minLength} to ${maxLength} characters with a mix of letters(lower & upper case), numbers & symbols among (!@#$%^&*)`;
    // `Password must contain min ${minLength} to max ${maxLength} characters that include at least 1 lowercase, 1 UPPERCASE, 1 number and 1 special character among (!@#$%^&*)`;
  }
 
  e.target.classList.toggle('wrong-input', invalid.error);
  $('.client-validate--pwd').innerText = invalid.msg;

  
  validatePwd.err = false;
  if(invalid.error) 
    validatePwd.err = true;
}

const validateConfirmPwd = e => {
  const value = e.target.value.trim();
  const invalid = { msg: '', error: false };
  const minLength = 7, maxLength = 18;

  if($('.signin__form__field--error') != null)
    $('.signin__form__field--error').style.display = "none";

  if(value.length <= 0) {
    $('.client-validate--pwd').innerText = '';
    e.target.classList.remove('wrong-input');
    return;
  }

  // value.length >= 1  
  const pwdRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*()])(?=.{7,18}$)/;
  if(!pwdRegEx.test(value)) {
    invalid.error = true;
    invalid.msg = 
    `Use ${minLength} to ${maxLength} characters with a mix of letters, numbers & symbols among (!@#$%^&*)`;
    // `Password must contain min ${minLength} to max ${maxLength} characters that include at least 1 lowercase, 1 UPPERCASE, 1 number and 1 special character among (!@#$%^&*)`;
  }

  if($('.signup__form__password').value !== e.target.value) {
    invalid.error = true;
    invalid.msg = "Confirm password doesn't match new Password"
  }
  
  e.target.classList.toggle('wrong-input', invalid.error);
  $('.client-validate--pwd').innerText = invalid.msg;

  
  validateConfirmPwd.err = false;
  if(invalid.error) 
    validateConfirmPwd.err = true;
}

// event listeners
$('.signup__form__email').addEventListener('input', validateEmail);
$('.signup__form__password').addEventListener('input', validatePwd);
$('.signup__form__password--confirm').addEventListener('input', validateConfirmPwd);

$('.signup__form').addEventListener('submit', e => {
  if(validateEmail.err || validatePwd.err || validateConfirmPwd.err) 
    return e.preventDefault();
  
})


$('#pwd-checkbox').addEventListener('change', e => {
  const { value } = e.target;

  $$('.signup__form__password').forEach(field => {
    field.type = (field.type === "password") ? "text" : "password";
  })

  const state = (value === "hide") ? "show" :"hide";
  e.target.value = state;
})

