import { $, $$, addGlobalEventListener, elaspedTime, workCompleted } from './utility.js';

//----<profy_main header>
$('[data-project-options-icon]').addEventListener('click', e => {
  e.target.blur();
  if(!$('[data-project-options-dropdown]').classList.contains('open')) {
    $('[data-project-options-dropdown]').classList.add('open');
    $('[data-project-options-backdrop]').setAttribute('aria-hidden', 'false');
    document.body.style.overflowY = 'hidden';
    return;
  } 

  $('[data-project-options-dropdown]').classList.remove('open');
  $('[data-project-options-backdrop]').setAttribute('aria-hidden', 'true');
  document.body.style.overflowY = 'auto';
})
addGlobalEventListener('click', '[data-project-options]', 
e => {
  $('[data-project-options-dropdown]').classList.remove('open');
  $('[data-project-options-backdrop]').setAttribute('aria-hidden', 'true');
  document.body.style.overflowY = 'auto';
})
addGlobalEventListener('click', '[data-project-options-backdrop]', 
e => {
  e.target.setAttribute('aria-hidden', 'true');
  $('[data-project-options-dropdown]').classList.remove('open');
  document.body.style.overflowY = 'auto';
})
//----</profy_main header>


// project options: overview,ideas,work
addGlobalEventListener('click', '[data-project-section-options]',
e => {
  const option = e.target.dataset.projectSectionOptions;
  for(const item of $$('[data-project-section-options]')) {
    item.classList.remove('selected');
  }
  e.target.classList.add('selected');
})


//----<profy_overview section>
addGlobalEventListener('click', '[data-overview-edit-btn]', async e => {
  const inputField = e.target.parentElement.previousElementSibling.lastElementChild;
  for(const item of $$('[data-overview-field]')) {
    item.setAttribute('readonly', '');
  }
  inputField.removeAttribute('readonly');
  inputField.focus();

  for(const item of $$('.overview__change-btn')) {
    item.classList.remove('edit');
  }
  const parentEl = e.target.parentElement;
  parentEl.classList.add('edit');
})
addGlobalEventListener('click', '[data-overview-cancel-btn]', e => {
  const inputField = e.target.parentElement.previousElementSibling.lastElementChild;
  inputField.setAttribute('readonly', '');
  inputField.blur();

  const parentEl = e.target.parentElement;
  parentEl.classList.remove('edit');
})
//----</profy_overview section>


//----<profy_ideas section>
$('[data-ideas-imgUrl]').addEventListener('input', e => {
  $('.ideas-form__imgUpload').classList.toggle('notouch', e.target.value);
})
// idea img upload 
$('[data-ideas-imgUpload]').addEventListener('change', e => {
  const file = e.target.files[0];
  $('.ideas-form__imgUrl').classList.toggle('notouch', file);
  if(file == null) {
    $('[data-imgUpload-preview-wrap]').style.display = null;
    return;
  }

  $('[data-imgUpload-preview-wrap]').style.display = 'block';
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', e => {
    $('[data-imgUpload-preview-src]').setAttribute('src', e.target.result);
    $('[data-imgUpload-preview-src]').setAttribute('alt', file.name);
    console.log(file);
  })
})

// project idea options icon
addGlobalEventListener('click', '[data-idea-options-icon]', e => {
  const optionEle = e.target.nextElementSibling;
  const optionIsOpen = (optionEle.getAttribute('aria-hidden') === 'true') ? 'false' : 'true';
  for(const item of $$('.idea__options')) {
    item.setAttribute('aria-hidden', 'true');
  }
  optionEle.setAttribute('aria-hidden', optionIsOpen);
})
// for each project idea option
addGlobalEventListener('click', '[data-idea-options]', e => {
  const optionEle = e.target.parentElement;
  optionEle.setAttribute('aria-hidden', 'true');
})
// idea edit option
addGlobalEventListener('click', '[data-idea-options="edit"]', e => {
  const ideaEl = e.target.closest('.idea');
  const ideaDesc = ideaEl.querySelector('[data-idea-description]').innerText;
  const ideaImgUrl = ideaEl.querySelector('[data-idea-imgUrl]').getAttribute('src');

  $('[data-idea-edit-description]').value = ideaDesc;
  $('[data-idea-edit-imgUrl]').value = ideaImgUrl;
  $('.edit__idea__save-btn').setAttribute('disabled','');

  $('[data-ideaEdit-modal]').showModal();
})
addGlobalEventListener('click', '[data-ideaEdit-modal-close]', e => {
  $('[data-idea-edit-description]').value = '';
  $('[data-idea-edit-imgUrl]').value = '';
  $('[data-ideaEdit-modal]').close();
})
// idea delete option
addGlobalEventListener('click', '[data-idea-options="delete"]', e => {
  $('[data-ideaDelete-modal]').showModal();
})
addGlobalEventListener('click', '[data-ideaDelete-modal-close]', e => {
  $('[data-ideaDelete-modal]').close();
})

// for diasbling non altered txt
$('[data-idea-edit-description]').addEventListener('input', e => {
  $('.edit__idea__save-btn').removeAttribute('disabled');
})
//----</profy_ideas section>





// overview timeElasped & workDone 
window.addEventListener('load', () => {

  // Time Elasped
  const eT = elaspedTime(
    $('[data-overview-end-date]').value,
    $('[data-overview-start-date]').value
  );
  $('[data-time-progress-value]').innerText = eT.time;
  $('.circleThumb--time').style.setProperty('--value', eT.time);
  $('[data-time-progress-daysLeft]').innerText = eT.days;


  // Work Completed: complete-45 total-70
  const wC = workCompleted(45, 70);
  $('[data-work-progress-value]').innerText = wC.work;
  $('.circleThumb--work').style.setProperty('--value', wC.work);
  $('[data-work-progress-daysLeft]').innerText = wC.tasks;

})



// click event debugger
// document.addEventListener('click', e => {
//   console.dir(e.target);
// })



