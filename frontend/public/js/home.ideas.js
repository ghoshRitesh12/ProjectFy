import { $, $$, addGlobalEventListener } from './utility.js';

//----<profy_ideas form_section>
addGlobalEventListener('input', '[data-ideasForm-imgUrl]', e => {
  $('.ideas-form__imgUpload').classList.toggle('notouch', e.target.value);
})

// show/hide idea form
addGlobalEventListener('click', '.reveal', e => {
  const ideasForm = e.target.parentElement;
  const isCollapsed = ideasForm.classList.contains('collapsed') ? false : true;
  ideasForm.classList.toggle('collapsed', isCollapsed);
  
  $('.reveal__icon').classList.toggle('rotate');
  if($('.reveal__txt').classList.contains('hide')) {
    $('.reveal__txt').classList.replace('hide', 'show'); return;
  }
  $('.reveal__txt').classList.replace('show', 'hide');
})

// idea img upload 
addGlobalEventListener('change', '[data-ideasForm-imgUpload]', e => {
  $('.ideas-form').setAttribute('enctype', 'multipart/form-data');
  const file = e.target.files[0];
  $('.ideas-form__imgUrl').classList.toggle('notouch', file);

  if(file == null) {
    $('.ideas-form').removeAttribute('enctype');
    $('[data-imgUpload-preview-wrap]').style.display = null;
    e.target.value = '';
    return;
  }
  $('[data-imgUpload-preview-src]').setAttribute('src', '');
  $('[data-imgUpload-preview-src]').setAttribute('alt', '');
  
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', e => {
    $('[data-imgUpload-preview-src]').setAttribute('src', e.target.result);
    $('[data-imgUpload-preview-src]').setAttribute('alt', file.name);
  })
  $('[data-imgUpload-preview-wrap]').style.display = 'block';
})

// idea img upload preview close button
addGlobalEventListener('click', '[data-idea-imgUpload-preview-closebtn]', e => {
  $('.ideas-form').removeAttribute('enctype');
  const parentEl = e.target.parentElement;
  parentEl.style.display = null;
  
  // upload new img after closing existing
  const fileInput = parentEl.previousElementSibling;
  fileInput.value = '';
  $('[data-imgUpload-preview-src]').setAttribute('src', '');
  $('[data-imgUpload-preview-src]').setAttribute('alt', '');
  $('.ideas-form__imgUrl').classList.remove('notouch');
})

//----</profy_ideas form_section>





//----<profy_ideas idea_section>
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
  $('[data-idea-edit-description]').value = ideaDesc;

  const ideaImg = ideaEl.querySelector('[data-idea-imgUrl]');
  const ideaImgVal = ideaImg.dataset.ideaImgurl;
  const ideaImgType = {
    srcUrl() { 
      $('.edit__idea__img').classList.remove('upload');
      $('.edit__idea__img').classList.add('url');
      $('.edit__idea').removeAttribute('enctype');
      $('[data-idea-edit-imgUrl]').value = ideaImg.getAttribute('src');
    },
    srcUpload() {
      $('.edit__idea__img').classList.remove('url');
      $('.edit__idea__img').classList.add('upload');
      $('[data-idea-edit-imgUpload-preview]').classList.remove('hide');
      $('.edit__idea').setAttribute('enctype', 'multipart/form-data');
      $('[data-idea-edit-imgUpload]').setAttribute('src', ideaImg.getAttribute('src'));
    }
  }
  ideaImgType[ideaImgVal]();


  document.body.dataset.scrolly = 'false';
  $('[data-idea-edit-modal]').showModal();
})
addGlobalEventListener('click', '[data-idea-edit-modal-close]', e => {
  $('[data-idea-edit-description]').value = '';
  $('[data-idea-edit-imgUrl]').value = '';
  $('[data-idea-edit-imgUpload]').setAttribute('src','');
  
  document.body.dataset.scrolly = 'true';
  $('[data-idea-edit-modal]').close();
})

// close edit preview img
addGlobalEventListener('click', '[data-idea-edit-imgUpload-preview-closebtn]', e => {
  const parentEl = e.target.parentElement;
  parentEl.classList.add('hide');

  // upload new img after closing existing
  const fileInput = parentEl.nextElementSibling;
  fileInput.value = '';
  fileInput.classList.remove('notouch');
  fileInput.setAttribute('required', '');
})

// idea edit img upload
addGlobalEventListener('change', '[data-idea-edit-imgUpload-btn]', e => {
  const file = e.target.files[0];
  if(file == null) {
    $('[data-idea-edit-imgUpload-preview]').classList.add('hide'); 
    e.target.value = '';
    return;
  }
  
  $('[data-idea-edit-imgUpload-preview]').classList.remove('hide'); 
  const reader = new FileReader();
  reader.addEventListener('load', e => $('[data-idea-edit-imgUpload]').setAttribute('src', e.target.result))
  reader.readAsDataURL(file);
})

// idea delete option
addGlobalEventListener('click', '[data-idea-options="delete"]', e => $('[data-idea-delete-modal]').showModal())
addGlobalEventListener('click', '[data-idea-delete-modal-close]', e => $('[data-idea-delete-modal]').close())

//----</profy_ideas idea_section>

