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


// for adding new projects
addGlobalEventListener('click', '[data-add-item]', e => {
  const itemType = e.target.dataset.addItem;
  const newItemForm = `.new-${itemType}Form`;

  for(const item of $$('.newItemForm')) { 
    item.classList.add('hidden');
  }
  $(newItemForm).classList.remove('hidden');
  $(newItemForm).firstElementChild.focus();
})
// for canceling new project/label creation
addGlobalEventListener('click', '[data-newItem-btn-cancel]', e => {
  const itemForm = e.target.parentElement.parentElement;
  itemForm.classList.add('hidden');

})

// for selecting projects
addGlobalEventListener('click', '[data-project-list-items]',
e => {
  for (const item of $$('[data-project-list-items]')) {
    item.classList.remove('selected');
  }


  e.target.classList.add('selected');
})



// imp home navigation
addGlobalEventListener('click', '[data-nav]', 
  e => window.location.href = e.target.dataset.nav 
)

window.addEventListener('load', () => {
  for(const item of $$('[data-project-list-items]')) {
    const clr = randomBoxClr();
    item.style.setProperty('--clr-box', clr);
  }

  for(const item of $$('[data-label-list-item]')) {
    const clr = randomBoxClr();
    item.style.setProperty('--rndm-clr', clr);
  }
})


// -------------------------------------



// just testing stuff 😅

// adding new project
// $('[data-add-item="project"]').addEventListener('click', 
// async e => {
//   $('.newProjectContainer').classList.remove('hidden');
//   $('.newProjectContainer').innerHTML = '';
//   const projectTemplate = $('#new-project-item__template').content.cloneNode(true).children[0];

//   // const newProject = projectTemplate.querySelector('.newProject');
//   // const projectNameInput = await projectTemplate.querySelector('.newProjectName');
//   // projectNameInput.focus();

//   await $('.newProjectContainer').append(projectTemplate);

//   projectTemplate.querySelector('[name="newProjectName"]').focus();
// })
// addGlobalEventListener('click', '[data-btn-cancel]', e => {
//   $('.newProjectContainer').classList.add('hidden');
// })


// addGlobalEventListener('click', '.profy__sidepanel__nav__list--projects-listItem',
// e => {
//   for(const item of $$('.profy__sidepanel__nav__list--projects-listItem')) {
//     item.classList.remove('selected');
//   }
//   e.target.classList.add('selected');
// })
