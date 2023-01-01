import { $, $$, addGlobalEventListener, getIdeaDate } from './utility.js';

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
  const file = e.target.files[0];
  $('.ideas-form__imgUrl').classList.toggle('notouch', file);

  if(file == null) {
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


const getUploadedImgUrl = async (uploadedFile) => {
  const API_KEY = '961614778299451';
  const CLOUD_NAME = 'dkyd3fcba';
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  try {
    const signatureResponse = await fetch('/api/v1/get-signature', {
      method: 'POST'
    });
    const parsedData = await signatureResponse.json();

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('api_key', API_KEY);
    formData.append('signature', parsedData.signature);
    formData.append('timestamp', parsedData.timestamp);

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData
    });

    const cloudData = await cloudinaryResponse.json();
    return {
      url: cloudData.secure_url,
      imageId: cloudData.public_id
    };

  } catch (err) {
    console.log(err);    
  }
}
// create idea *form submit*
addGlobalEventListener('submit', '.ideas-form', async e => {
  e.preventDefault();
  $('.ideas-form__submit--btn').textContent = '...Creating idea';
  const url = `${location.href}${e.target.getAttribute('action')}`;

  const creationDate = getIdeaDate();
  const ideaDescription = $('[data-ideasForm-description]').value;
  const isImgAUrl = ($('[data-ideasForm-imgUpload]').files.length <= 0) ? true : false;
  const imgUrl = $('[data-ideasForm-imgUrl]').value;

  const ideaInfo = {
    creationDate,
    ideaDescription,
    isImgAUrl,
    imgUrl,
    imgUpload: null,
    hostedImgId: null
  }

  try {
    if(!isImgAUrl) {
      const file = $('[data-ideasForm-imgUpload]').files[0];
      const imgUploadInfo = await getUploadedImgUrl(file)

      ideaInfo.imgUrl = null;
      ideaInfo.imgUpload = imgUploadInfo.url;
      ideaInfo.hostedImgId = imgUploadInfo.imageId;
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ideaInfo)
    })

    if(resp.redirected === true) {
      location.reload();
      return;
    } 

    $('.ideas-form__submit--btn').textContent = '...Just a sec';

    const data = resp && (await resp.json());
    if(data.status !== 'ok') {
      $('[data-error-notify-msg]').textContent = data.msg;
      $('.error_notify').classList.add('show');
      return;
    }
    location.reload();

  } catch (error) {
    console.log(error);
  }
})

window.addEventListener('load', e => {
  if($('.profy__main__section--ideas') !== null)
    $('.ideas-form__submit--btn').textContent = 'Create idea';
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

  const formAction = `${location.href}/edit/${ideaEl.dataset.ideaId}`;
  $('.edit__idea').setAttribute('action', formAction);

  const ideaImg = ideaEl.querySelector('[data-idea-imgUrl]');
  const ideaImgVal = ideaImg.dataset.ideaImgurl;
  const ideaImgType = {
    srcUrl() { 
      $('.edit__idea__img').classList.remove('upload');
      $('.edit__idea__img').classList.add('url');
      $('[data-idea-edit-imgUrl]').value = ideaImg.getAttribute('src');
    },
    srcUpload() {
      $('.edit__idea__img').classList.remove('url');
      $('.edit__idea__img').classList.add('upload');
      // $('[data-idea-edit-imgUpload-preview]').classList.remove('hide');
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
  
  $('.edit__idea').setAttribute('action', '');
  document.body.dataset.scrolly = 'true';
  $('[data-idea-edit-modal]').close();
})

// edit idea *form submit*
addGlobalEventListener('submit', '.edit__idea', async e => {
  e.preventDefault();
  const url = e.target.getAttribute('action');
  const ideaDescription = $('[data-idea-edit-description]').value;
  const imgUrlValue = $('[data-idea-edit-imgurl]').value;
  const imgUrl = imgUrlValue ? imgUrlValue : null;

  const ideaInfo = {
    ideaDescription,
    imgUrl
  }

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ideaInfo)
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



// idea delete option
addGlobalEventListener('click', '[data-idea-options="delete"]', e => {
  $('.delete__idea__description__btns [type="submit"]').textContent = 'Delete';
  const ideaItem = e.target.closest('.idea');
  const ideaItemId = ideaItem.dataset.ideaId;
  const formAction = `${location.href}/delete/${ideaItemId}`;
  $('.delete__idea').setAttribute('action', formAction);

  document.body.dataset.scrolly = 'false';
  $('[data-idea-delete-modal]').showModal();
})
addGlobalEventListener('click', '[data-idea-delete-modal-close]', e =>  {
  $('.delete__idea').setAttribute('action', '');

  document.body.dataset.scrolly = 'true';
  $('[data-idea-delete-modal]').close()
})

// delete idea *form submit*
addGlobalEventListener('submit', '.delete__idea', async e => {
  e.preventDefault();
  const url = e.target.getAttribute('action');

  $('.delete__idea__description__btns [type="submit"]').textContent = '...Deleting idea';

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if(resp.redirected === true) {
      location.reload();
      return;
    } 

    $('.delete__idea__description__btns [type="submit"]').textContent = '...Just a sec';

    const data = resp && (await resp.json());
    if(data.status !== 'ok') {
      $('[data-error-notify-msg]').textContent = data.msg;
      $('.error_notify').classList.add('show');
      return;
    }
    location.reload();

  } catch (err) {
    console.log(err)
  }
})

//----</profy_ideas idea_section>

export { getUploadedImgUrl };
