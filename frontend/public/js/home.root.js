import { $, $$, addGlobalEventListener, randomBoxClr } from './utility.js';


// account
$('[data-account]').addEventListener('click', e => {
  e.target.blur();
  if(!$('[data-account-dropdown]').classList.contains('open')) {
    $('[data-account-dropdown]').classList.add('open');
    $('[data-account-dropdown-backdrop]').setAttribute('aria-hidden', 'false');
    return;
  } 

  $('[data-account-dropdown]').classList.remove('open');
  $('[data-account-dropdown-backdrop]').setAttribute('aria-hidden', 'true');
  
})
// account-dropdown-backdrop
addGlobalEventListener('click', '[data-account-dropdown-backdrop]', 
e => {
  e.target.setAttribute('aria-hidden', 'true');
  $('[data-account-dropdown]').classList.remove('open');
})
// data-account-options toggle
addGlobalEventListener('click', '[data-account-options]', 
e => {
  $('[data-account-dropdown]').classList.remove('open');
  $('[data-account-dropdown-backdrop]').setAttribute('aria-hidden', 'true');
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

// for (const item of $$('[data-project-list-items]')) {
//   item.addEventListener('click', e => {
//     for (const item of $$('[data-project-list-items]')) {
//       item.classList.remove('selected');
//     }
//     e.target.classList.add('selected');
//   })
// }




//----<profy_main header>
$('[data-project-options-icon]').addEventListener('click', e => {
  e.target.blur();
  if(!$('[data-project-options-dropdown]').classList.contains('open')) {
    $('[data-project-options-dropdown]').classList.add('open');
    $('[data-project-options-backdrop]').setAttribute('aria-hidden', 'false');
    // document.body.style.overflowY = 'hidden';
    return;
  } 

  $('[data-project-options-dropdown]').classList.remove('open');
  $('[data-project-options-backdrop]').setAttribute('aria-hidden', 'true');
  // document.body.style.overflowY = 'auto';
})
addGlobalEventListener('click', '[data-project-options]', 
e => {
  $('[data-project-options-dropdown]').classList.remove('open');
  $('[data-project-options-backdrop]').setAttribute('aria-hidden', 'true');
  // document.body.style.overflowY = 'auto';
})
addGlobalEventListener('click', '[data-project-options-backdrop]', 
e => {
  e.target.setAttribute('aria-hidden', 'true');
  $('[data-project-options-dropdown]').classList.remove('open');
  // document.body.style.overflowY = 'auto';
})
//----</profy_main header>


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
