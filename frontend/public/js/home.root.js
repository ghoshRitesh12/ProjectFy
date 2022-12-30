import { 
  $, $$, addGlobalEventListener, randomBoxClr, 
  greetUser, getHomeDate, convertDbDate  
} from './utility.js';

import { getUploadedImgUrl } from './home.ideas.js'; 

// account
addGlobalEventListener('click', '[data-account]', e => {
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
addGlobalEventListener('click', '[data-account-dropdown-backdrop]', e => {
  e.target.setAttribute('aria-hidden', 'true');
  $('[data-account-dropdown]').classList.remove('open');
})
// data-account-options toggle
addGlobalEventListener('click', '[data-account-options]', e => {
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
    location.reload();

  } catch (err) {
    location.href = '/';
  }
})



// adding new projects/labels
addGlobalEventListener('click', '[data-add-item]', e => {
  const parentElement = e.target.parentElement.parentElement;
  const itemType = e.target.dataset.addItem;
  const newItemForm = parentElement.querySelector(`.new-${itemType}Form`);
  
  for(const item of $$('.newItemForm')) { 
    item.classList.add('hidden');
  }
  
  newItemForm.classList.remove('hidden');
  newItemForm.firstElementChild.focus();
})

// canceling new project/label creation
addGlobalEventListener('click', '[data-newItem-btn-cancel]', e => {
  for (const item of $$('.field_empty')) { 
    item.style.display = null; 
  }
  // nulling the label & project input fields
  for (const item of [...$$('.newItemForm')].map(i => i.querySelector('input'))) { 
    item.value = ''; 
  }

  const itemForm = e.target.parentElement.parentElement;
  itemForm.classList.add('hidden');
})

// form submit event to create projects and labels
addGlobalEventListener('submit', '.newItemForm', async e => {
  e.preventDefault();
  const itemType = e.target.dataset.itemName;
  const formAction = e.target.getAttribute('action');
  const emptyFieldEle = e.target.querySelector('.field_empty');

  const itemAction = {
    project() {
      const currentDate = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
      const projectName = e.target.querySelector('input[name="newProjectName"]').value.trim();
      const projectStartDate = currentDate;
      if(projectName === '') {
        emptyFieldEle.style.display = 'block';
        e.target.querySelector('input[name="newProjectName"]').focus();
        return null;
      }

      return { projectName, projectStartDate };
    },
    label() {
      const labelName = e.target.querySelector('input[name="newLabelName"]').value.trim();
      const labelColor = randomBoxClr();
      if(labelName === '') {
        emptyFieldEle.textContent = '! Enter valid label name';
        emptyFieldEle.style.display = 'block';
        e.target.querySelector('input[name="newLabelName"]').focus();
        return null;
      }

      const allLabels = [...$$('[data-label-list-item]')].map(i => i.firstElementChild.textContent.toLowerCase().trim());
      if(allLabels.includes(labelName.toLowerCase())) {
        emptyFieldEle.textContent = '! Label aleady exists';
        emptyFieldEle.style.display = 'block';
        e.target.querySelector('input[name="newLabelName"]').focus();
        return null;
      }

      return { labelName, labelColor };
    }
  }

  const itemInfo = itemAction[itemType]();
  if(itemInfo == null) return;

  try {
    const resp = await fetch(formAction, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemInfo)
    });
    
    if(resp.redirected === true) {
      location.reload();
      return;
    } 
    const data = await resp.json();
    const redirectTo = data && data.redirectTo;
    if(redirectTo == null) {
      location.reload();
      return;
    }
    location.href = redirectTo;

  } catch (err) {
    console.log(err.message);
  }
})



//-----<data project options>
// project options
addGlobalEventListener('click', '[data-project-options]', e => {
  const projectId = e.target.closest('.profy__main').dataset.projectId;
  const projectOption = e.target.dataset.projectOptions;
  const optionUrl = `${e.target.dataset.optionAction}/${projectId}`;
  console.log({ projectId, projectOption, optionUrl });
  document.body.dataset.scrolly = 'false';

  if(projectOption === "delete") {
    $('.delete__project').setAttribute('action', optionUrl);
    $('[data-project-delete-modal]').showModal();
    return;
  }
  
  // for share
  $('[data-share-link-submitter="makeShareLinkPrivate"]').textContent = 'Make project private';
  $('[data-share-link-submitter="getShareLink"]').textContent = 'Get link';
  $('.share__project').setAttribute('action', optionUrl);
  $('[data-project-share-modal]').showModal();
})


// share: project share *form submit*
addGlobalEventListener('submit', '.share__project', async e => {
  e.preventDefault();
  const submitter = e.submitter.dataset.shareLinkSubmitter;
  const formAction = $('.share__project').getAttribute('action');

  try {
    if(submitter === "getShareLink") {
      $('[data-share-link-submitter="getShareLink"]').textContent = 'Just a sec...';
      
      const resp = await fetch(formAction, { method: 'POST' });
      // console.log('data' in (await resp.json()));
      // const data = await resp.json() || 'http://127.0.0.1:5500/niqqaaXafafafafafafafhquirghqDD/homePage.html';
      const data = await resp.json();

      if(data.status !== 'ok') {
        $('[data-share-link-submitter="getShareLink"]').textContent = data.msg;
        return;
      }
      
      $('[data-share-link-submitter="getShareLink"]').textContent = 'Link fetched';
      $('[data-share-link-submitter="getShareLink"]').style.pointerEvents = 'none';
      $('[data-project-share-link]').textContent = data.msg || data;
      $('[data-project-share-wrapper]').classList.add('show');
      
      return;
    }

    // makeShareLinkPrivate
    const privateFormAction = formAction.replace('gen-sharelink', 'make-sharelink-private');
    $('[data-share-link-submitter="makeShareLinkPrivate"]').textContent = 'Invalidating link....';
    
    const resp = await fetch(privateFormAction, { method: 'POST' });
    const data = await resp.json() || 'Link invalidated';

    if(data.status !== 'ok') {
      $('[data-share-link-submitter="makeShareLinkPrivate"]').textContent = data.msg;
      return;
    }

    $('[data-share-link-submitter="makeShareLinkPrivate"]').textContent = data.msg || data;
    $('[data-share-link-submitter="makeShareLinkPrivate"]').style.pointerEvents = 'none';

  } catch (err) {
    console.log(err) 
  }
})  

// share: copy share link to clipboard
addGlobalEventListener('click', '[data-project-share-link-copy]', e => {
  const shareLinkEle = e.target.previousElementSibling;

  navigator.clipboard.writeText(shareLinkEle.textContent.trim());
  e.target.textContent = 'copied link';
  setTimeout(() => e.target.textContent = 'copy', 700)
})

// share: close share project modal
addGlobalEventListener('click', '[data-project-share-modal-close]', e => {
  $('.share__project').setAttribute('action', '');
  $('[data-project-share-link]').textContent = '';
  $('[data-project-share-wrapper]').classList.remove('show');
  $('[data-share-link-submitter="getShareLink"]').style.pointerEvents = 'all';
  $('[data-share-link-submitter="makeShareLinkPrivate"]').style.pointerEvents = 'all';

  document.body.dataset.scrolly = 'true';
  $('[data-project-share-modal]').close();
})



// delete: delete project form submit
addGlobalEventListener('submit', '.delete__project', async e => {
  e.preventDefault();
  const formAction = e.target.getAttribute('action');

  try {
    const resp = await fetch(formAction, { method: 'POST' });
    if(resp.redirected === true) {
      location.reload();
      return;
    }

    const data = await resp.json();
    if(data.redirectTo == null) return;
    location.href = data.redirectTo;

  } catch (err) {
    console.log(err);
  }
})

// delete: close delete project modal
addGlobalEventListener('click', '[data-project-delete-modal-close]', e => {
  $('.delete__project').setAttribute('action', '');
  document.body.dataset.scrolly = 'true';
  $('[data-project-delete-modal]').close();
})

//-----</data project options>



//----<labels section>
// label delete icon
addGlobalEventListener('click', '[data-label-delete-icon]', e => {
  const labelElement = e.target.closest('[data-label-id]');
  const labelId = labelElement.dataset.labelId;
  const labelName = labelElement.firstElementChild.textContent.trim();

  const formAction = `/labels/delete/${labelId}`
  $('.delete__label').setAttribute('action', formAction);
  $('[data-label-delete-name]').textContent = labelName;

  document.body.dataset.scrolly = 'false';
  $('[data-label-delete-modal]').showModal();
})

// close label delete modal
addGlobalEventListener('click', '[data-label-delete-modal-close]', e => {
  $('.delete__label').setAttribute('action', '');
  document.body.dataset.scrolly = 'true';
  $('[data-label-delete-modal]').close();
})

// label delete *form submit*
addGlobalEventListener('submit', '.delete__label', async e => {
  e.preventDefault();
  const url = e.target.getAttribute('action');

  try {
    const resp = await fetch(url, { method: 'POST' }); 

    if(resp.redirected === true) {
      location.reload();
      return;
    } 

    const data = await resp.json();
    const redirectTo = data && data.redirectTo;
    if(redirectTo == null) location.reload();

  } catch (err) {
    console.log(err);
  }
})

//----</labels section>




//----<profile_settings section>
// settings: show user profile password
addGlobalEventListener('click', '[data-settings-show-password]', e => {
  const passwordField = e.target.previousElementSibling;
  const isHidden = (passwordField.getAttribute('type') === 'text') ? 'password' : 'text';
  passwordField.setAttribute('type', isHidden);

  if(isHidden === 'text') e.target.textContent = 'hide';
  else e.target.textContent = 'show';
})

// settings: edit profile name
addGlobalEventListener('click', '[data-profile-name-edit-btn]', e => {
  const inputField = e.target.parentElement.previousElementSibling;
  const parentEl = e.target.parentElement;

  inputField.removeAttribute('readonly');
  inputField.focus();
  parentEl.classList.add('edit');
  
  const formAction = `/profile-settings/profileNameChange`;
  $('[data-profile-settings-form]').setAttribute('action', formAction);
})

// settings: cancel edit profile name
addGlobalEventListener('click', '[data-profile-name-cancel-btn]', e => {
  const inputField = e.target.parentElement.previousElementSibling;
  inputField.setAttribute('readonly', '');
  inputField.blur();

  $('[data-profile-settings-form]').setAttribute('action', '');
  const parentEl = e.target.parentElement;
  parentEl.classList.remove('edit');
})

// settings: submit form -name change
addGlobalEventListener('submit', '[data-profile-settings-form]', async e => {
  e.preventDefault();
  const url = e.target.getAttribute('action');
  const changedName = e.target.querySelector('.details__name--field').value.trim();

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ changedName })
    })
    
    if(resp.redirected === true) {
      location.reload();
      return;
    } 
    const data = resp && (await resp.json());
    if(data.status !== 'ok') {
      $('[data-error-notify-msg]').textContent = data.msg;
      $('.error_notify').classList.add('show');
      return;
    }
    location.reload();

  } catch (err) {
    console.log(err);
  }
})

// settings: account deletion prompt
addGlobalEventListener('click', '[data-settings-delete-account-btn]', e => {
  document.body.dataset.scrolly = 'false';
  $('[data-account-delete-modal]').showModal();
});
addGlobalEventListener('click', '[data-account-delete-modal-close]', e => {
  document.body.dataset.scrolly = 'true';
  $('[data-account-delete-modal]').close();
});

// settings: account deletion *form submit* 
addGlobalEventListener('submit', '.delete__account', async e => {
  e.preventDefault();
  const url = e.target.getAttribute('action');

  try {
    const resp = await fetch(url, { method: 'POST' });
    console.log(resp);
    
    if(resp.redirected === true) {
      location.reload();
      return;
    } 
    
    const data = resp && (await resp.json());
    if(data.status !== 'ok') {
      $('[data-error-notify-msg]').textContent = data.msg;
      $('.error_notify').classList.add('show');
      return;
    }

    if(data.redirectTo == null) return;
    location.href = data.redirectTo;

  } catch (err) {
    console.log(err);
  }
})

addGlobalEventListener('change', '[data-profile-pic-upload-field]', async e => {
  const file = e.target.files[0];
  const url = `${location.href}/profile-pic`

  if(file == null) {
    e.target.value = '';
    return;
  }

  const imgUploadInfo = await getUploadedImgUrl(file);
  const profilePicInfo = {
    picUrl: imgUploadInfo.url,
    picId: imgUploadInfo.imageId
  }

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profilePicInfo)
    })

    if(resp.redirected === true) {
      location.reload();
      return;
    } 

    const data = resp && (await resp.json());
    if(data.status !== 'ok') {
      $('[data-error-notify-msg]').textContent = data.msg;
      $('.error_notify').classList.add('show');
      return;
    }
    location.reload();
    
  } catch (err) {
    console.log(err); 
  }
})

//----</profile_settings section>


// close error notify
addGlobalEventListener('click', '[data-error-notify-close]', e => {
  e.target.parentElement.classList.remove('show');
})


// for selecting projects
// addGlobalEventListener('click', '[data-project-list-items]',
// e => {
//   for (const item of $$('[data-project-list-items]')) {
//     item.classList.remove('selected');
//   }
//   e.target.classList.add('selected');
// })


// for (const item of $$('[data-project-list-items]')) {
//   item.addEventListener('click', e => {
//     for (const item of $$('[data-project-list-items]')) {
//       item.classList.remove('selected');
//     }
//     e.target.classList.add('selected');
//   })
// }







//----<profy_main header>
addGlobalEventListener('click', '[data-project-options-icon]', e => {
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


// url navigations
addGlobalEventListener('click', '[data-nav]', 
  e => window.location.href = e.target.dataset.nav 
)



window.addEventListener('load', () => {
  for(const item of $$('[data-project-list-items]')) {
    const clr = randomBoxClr();
    item.style.setProperty('--clr-box', clr);
  }


  if($('.profy__home') != null) {
    $('[data-home-greet-time]').textContent = getHomeDate();
    $('[data-home-greet-msg]').textContent = `${greetUser()}, `;

    for(const item of $$('.home-project')) {
      const clr = randomBoxClr();
      item.style.setProperty('--clr-box', clr);
    }
    
  }

  if($('.profy__projects') !== null) {
    for(const item of $$('.project')) {
      const clr = randomBoxClr();
      item.style.setProperty('--clr-box', clr);
    }
  }



})


// window.addEventListener('resize', e => {
//   const prevUrl = location.href;

//   if(e.target.innerWidth >= 640) 
//     location.href = '/';
//   else 
//     location.href = prevUrl;
//   console.log(prevUrl);

// })


// -------------------------------------
