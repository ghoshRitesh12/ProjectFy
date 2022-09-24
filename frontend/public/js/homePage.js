import { $, $$, addGlobalEventListener } from './utility.js';


// account
$('[data-account]').addEventListener('click', e => {
  e.target.blur();
  if(!$('[data-account-dropdown]').classList.contains('open')) {
    $('[data-account-dropdown]').classList.add('open');
    $('[data-account-dropdown-backdrop]').ariaHidden = 'false';
    document.body.style.overflowY = 'hidden';
  } else {
    $('[data-account-dropdown]').classList.remove('open');
    $('[data-account-dropdown-backdrop]').ariaHidden = 'true';
    document.body.style.overflowY = 'auto';
  }
})
// account-dropdown-backdrop
addGlobalEventListener('click', '[data-account-dropdown-backdrop]', 
e => {
  e.target.ariaHidden = 'true';
  $('[data-account-dropdown]').classList.remove('open');
  document.body.style.overflowY = 'auto';
})


// theme toggler
addGlobalEventListener('click', '[data-mode]', async e => {
  const mode = e.target.dataset.mode;
  try {
    if($('body').dataset.theme === mode) 
      return;
    
    $('body').dataset.theme = mode;
    const resp = await fetch('/api/v1/themechange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'themeChangedTo': mode })
    });
  } catch (err) {
    location.href = '/';
  }
})




// projects nav
$('.projectfy__sidepanel__nav__list--projects-wrapper').addEventListener('click', e => {
  // closing accounts dropdown
  // if($('.projectfy__sidepanel__nav__list--labels-list').classList.contains('open')) {
  //   $('.projectfy__sidepanel__preferences').classList.remove('open');
  //   $('.projectfy__sidepanel__account--options').classList.remove('rotated');
  // }

  if(!$('.projectfy__sidepanel__nav__list--projects-list').classList.contains('open')) {
    $('.projectfy__sidepanel__nav__list--projects-list').classList.add('open');
    e.target.lastElementChild.classList.add('rotated');
  }
  else {
    $('.projectfy__sidepanel__nav__list--projects-list').classList.remove('open');
    e.target.lastElementChild.classList.remove('rotated');
  }
})

// labels nav
$('.projectfy__sidepanel__nav__list--labels-wrapper').addEventListener('click', e => {
  // closing accounts dropdown
  // if($('.projectfy__sidepanel__nav__list--projects-list').classList.contains('open')) {
  //   $('.projectfy__sidepanel__preferences').classList.remove('open');
  //   $('.projectfy__sidepanel__account--options').classList.remove('rotated');
  // }


  if(!$('.projectfy__sidepanel__nav__list--labels-list').classList.contains('open')) {
    $('.projectfy__sidepanel__nav__list--labels-list').classList.add('open');
    e.target.lastElementChild.classList.add('rotated');
  }
  else {
    $('.projectfy__sidepanel__nav__list--labels-list').classList.remove('open');
    e.target.lastElementChild.classList.remove('rotated');
  }
})

// label items
addGlobalEventListener('click', '.projectfy__sidepanel__nav__list--labels-listItem',
e => {
  for(const item of $$('.projectfy__sidepanel__nav__list--labels-listItem')) {
    item.classList.remove('selected');
  }

  e.target.classList.add('selected');

})

// project items
addGlobalEventListener('click', '.projectfy__sidepanel__nav__list--projects-listItem',
e => {
  for(const item of $$('.projectfy__sidepanel__nav__list--projects-listItem')) {
    item.classList.remove('selected');
  }

  e.target.classList.add('selected');

})


// just testing stuff 😅


// adding new project
$('.projectfy__sidepanel__nav__list--projects-container__add-icon').addEventListener('click', 
async e => {
  $('.projectfy__sidepanel__nav__list--projects-list').classList.add('open');

  const projectTemplate = $('#project-item__template').content.cloneNode(true).children[0];
  const newProject = projectTemplate.querySelector('.newProject');
  // const projectNameInput = await projectTemplate.querySelector('.newProjectName');
  // projectNameInput.focus();

  $('.newProjectTemp').append(projectTemplate);
  projectTemplate.querySelector('.newProjectName').focus();

})

// addGlobalEventListener('click', '[data-btn-cancel]', e => {
//   console.log('bruh');
// })

addGlobalEventListener('input', '.newProjectName', e => {
  console.log(e.target.parentElement.parentElement.parentElement);
})


// imp home navigation
addGlobalEventListener('click', '[data-nav]', e => {
  window.location.href = e.target.dataset.nav;
  // window.location.href = '.';
})

