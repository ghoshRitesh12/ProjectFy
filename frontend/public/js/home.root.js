import { $, $$, addGlobalEventListener, randomBoxClr } from './utility.js';


// account
$('[data-account]').addEventListener('click', e => {
  e.target.blur();
  if(!$('[data-account-dropdown]').classList.contains('open')) {
    $('[data-account-dropdown]').classList.add('open');
    $('[data-account-dropdown-backdrop]').setAttribute('aria-hidden', 'false');
    document.body.style.overflowY = 'hidden';
    return;
  } 

  $('[data-account-dropdown]').classList.remove('open');
  $('[data-account-dropdown-backdrop]').setAttribute('aria-hidden', 'true');
  document.body.style.overflowY = 'auto';
  
})
// account-dropdown-backdrop
addGlobalEventListener('click', '[data-account-dropdown-backdrop]', 
e => {
  e.target.setAttribute('aria-hidden', 'true');
  $('[data-account-dropdown]').classList.remove('open');
  document.body.style.overflowY = 'auto';
})
// data-account-options toggle
addGlobalEventListener('click', '[data-account-options]', 
e => {
  $('[data-account-dropdown]').classList.remove('open');
  $('[data-account-dropdown-backdrop]').setAttribute('aria-hidden', 'true');
  document.body.style.overflowY = 'auto';
})


// theme toggler
addGlobalEventListener('click', '[data-mode]', async e => {
  const mode = e.target.dataset.mode;
  try {
    if($('body').dataset.theme === mode) 
      return;
    
    $('body').dataset.theme = mode;
    await fetch('/api/v1/themechange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'themeChangedTo': mode })
    });
    // window.history.go();

  } catch (err) {
    location.href = '/';
  }
})

// project options
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
// project-options-dropdown-backdrop
addGlobalEventListener('click', '[data-project-options-backdrop]', 
e => {
  e.target.setAttribute('aria-hidden', 'true');
  $('[data-project-options-dropdown]').classList.remove('open');
  document.body.style.overflowY = 'auto';
})
// data-project-options toggle
addGlobalEventListener('click', '[data-project-options]', 
e => {
  $('[data-project-options-dropdown]').classList.remove('open');
  $('[data-project-options-backdrop]').setAttribute('aria-hidden', 'true');
  document.body.style.overflowY = 'auto';
})



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

// different project options
addGlobalEventListener('click', '[data-project-section-options]',
e => {
  const option = e.target.dataset.projectSectionOptions;

  for(const item of $$('[data-project-section-options]')) {
    item.classList.remove('selected');
  }
  e.target.classList.add('selected');

  
})

// -------------------------------------



// just testing stuff 😅

// adding new project
$('[data-add-item="projects"]').addEventListener('click', 
async e => {
  $('.newProjectContainer').classList.remove('hidden');
  $('.newProjectContainer').innerHTML = '';
  const projectTemplate = $('#new-project-item__template').content.cloneNode(true).children[0];

  // const newProject = projectTemplate.querySelector('.newProject');
  // const projectNameInput = await projectTemplate.querySelector('.newProjectName');
  // projectNameInput.focus();

  await $('.newProjectContainer').append(projectTemplate);

  projectTemplate.querySelector('[name="newProjectName"]').focus();
})
addGlobalEventListener('click', '[data-btn-cancel]', e => {
  $('.newProjectContainer').classList.add('hidden');
})


// imp home navigation
addGlobalEventListener('click', '[data-nav]', 
  e => window.location.href = e.target.dataset.nav 
)

window.addEventListener('load', () => {
  // console.log(randomBoxClr());
  for(const item of $$('.profy__sidepanel__nav--projects-listItem')) {
    const clr = randomBoxClr();
    item.style.setProperty('--clr-box', clr);
  }
})


// addGlobalEventListener('click', '.profy__sidepanel__nav__list--projects-listItem',
// e => {
//   for(const item of $$('.profy__sidepanel__nav__list--projects-listItem')) {
//     item.classList.remove('selected');
//   }
//   e.target.classList.add('selected');
// })
