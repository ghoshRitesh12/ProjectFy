import { $, $$, addGlobalEventListener } from './utility.js';

//----<profy_kanban section>
// kanban item option
addGlobalEventListener('click', '[data-kanban-item-option-icon]', e => {
  const optionsEl = e.target.nextElementSibling;
  const isOpen = (optionsEl.getAttribute('aria-hidden') === 'true') ? 'false' : 'true';
  for (const item of $$('.kanban-item__options')) {
    item.setAttribute('aria-hidden', 'true');
  }
  optionsEl.setAttribute('aria-hidden', isOpen);
})
addGlobalEventListener('click', '[data-kanban-item-option]', e => {
  const optionsEl = e.target.parentElement;
  optionsEl.setAttribute('aria-hidden', 'true');
})

// collapse kanban section for mobile
addGlobalEventListener('click', '[data-hide-kanban-section]', e => {
  const parentElement = e.target.closest('.kanban-section');
  const collapseIcon = e.target.firstElementChild;

  const isSectionCollapsed = !parentElement.classList.contains('collapse');
  parentElement.classList.toggle('collapse', isSectionCollapsed);
  collapseIcon.classList.toggle('rotate', isSectionCollapsed);
})



// shifting kanban item
addGlobalEventListener('click', '[data-kanban-move-to]', async e => {
  const sectionToMoveTo = e.target.dataset.kanbanMoveTo;
  const kanbanSection = e.target.closest('.kanban-section').dataset.kanbanSection;
  const kanbanItem = e.target.closest('.kanban-list__item');
  const url = `${location.href}/${kanbanSection}/moveto/${kanbanItem.dataset.kanbanItemId}`
  
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sectionToMoveTo })
    });

    if(resp.redirected === true) {
      location.reload();
      return;
    } 
    const data = await resp.json();
    if(data.redirectTo == null) return;
    location.href = data.redirectTo;

  } catch (err) {
    console.log(err)
  }
})

// create kanban item
addGlobalEventListener('click', '[data-create-kanban]', async e => {
  const kanbanSection = e.target.dataset.createKanban;
  const formAction = `${kanbanSection}/create`;
  $('.edit__kanban').setAttribute('action', formAction);
  $('.edit__kanban__header--txt').innerText = 'Create kanban';
  $('[data-rest-labels-txt]').innerText = 'All Labels';

  const allLabels = [...$$('[data-label-list-item]')].map(j => { 
    return { 'text': j.innerText, 'el': j } 
  });
  for(const i of allLabels) {
    const labelColor = getComputedStyle(i.el).getPropertyValue('--rndm-clr');
    const restLabel = $('#template_rest-label').content.cloneNode(true).children[0];
    restLabel.style.setProperty('--clr-rest-label', labelColor);
    restLabel.querySelector('.rest-label__item--name').textContent = i.text;
    $('.edit__kanban__rest-labels').append(restLabel);
  }

  document.body.dataset.scrolly = 'false';
  $('[data-kanban-edit-modal]').showModal();
})

// edit kanban item
addGlobalEventListener('click', '[data-kanban-item-option="edit"]', async e => {
  const kanbanSection = e.target.closest('.kanban-section').dataset.kanbanSection;
  const kanbanItem = e.target.closest('.kanban-list__item');
  const formAction = `${kanbanSection}/edit/${kanbanItem.dataset.kanbanItemId}`; 
  $('.edit__kanban').setAttribute('action', formAction);
  $('.edit__kanban__header--txt').innerText = 'Edit kanban';
  $('[data-rest-labels-txt]').innerText = 'Other Labels';

  const allLabels = [...$$('[data-label-list-item]')].map(j => { 
    return { 'text': j.innerText, 'el': j } 
  });
  const itemLabels = [...kanbanItem.querySelectorAll('.kanban-item__label')].map(i => { 
    return { 'text': i.textContent, 'el': i } 
  });
  const restLabels = allLabels.filter(item => {
    const iL = itemLabels.map(i => i.text.trim());
    if(!iL.includes(item.text.trim())) 
      return { 'text': item.textContent, 'el': item }
  });

  for(const i of itemLabels) {
    const labelColor = getComputedStyle(i.el).getPropertyValue('--clr-label') || '#00AEFF';
    const existingLabel = $('#template_existing-label').content.cloneNode(true).children[0];
    existingLabel.style.setProperty('--clr-existing-label', labelColor);
    existingLabel.querySelector('.existing-label__item--name').textContent = i.text;
    $('.edit__kanban__existing-labels').append(existingLabel);
  }
  for(const i of restLabels) {
    const labelColor = getComputedStyle(i.el).getPropertyValue('--rndm-clr');
    const restLabel = $('#template_rest-label').content.cloneNode(true).children[0];
    restLabel.style.setProperty('--clr-rest-label', labelColor);
    restLabel.querySelector('.rest-label__item--name').textContent = i.text;
    $('.edit__kanban__rest-labels').append(restLabel);
  }

  const kanbanItemTitle = kanbanItem.querySelector('[data-kanban-title]').innerText;
  const kanbanItemDescription = kanbanItem.querySelector('[data-kanban-description]').innerText;
  $('[data-kanban-edit-title]').value = kanbanItemTitle;
  $('[data-kanban-edit-description]').value = kanbanItemDescription;

  document.body.dataset.scrolly = 'false';
  $('[data-kanban-edit-modal]').showModal();
})
addGlobalEventListener('click', '[data-kanban-edit-modal-close]', e => {
  $('.edit__kanban').setAttribute('action', '');
  $('.edit__kanban__existing-labels').innerHTML = '';
  $('.edit__kanban__rest-labels').innerHTML = '';
  $('[data-kanban-edit-title]').value = '';
  $('[data-kanban-edit-description]').value = '';
  
  document.body.dataset.scrolly = 'true';
  $('[data-kanban-edit-modal]').close();
})

// kanban item delete existing label
addGlobalEventListener('click', '[data-kanban-edit-existing-label-delete]',
e => {
  const currentLabel = e.target.parentElement;
  const currentLabelName = e.target.previousElementSibling.innerText;
  const labelColor = getComputedStyle(currentLabel).getPropertyValue('--clr-existing-label') || '#00AEFF';
  
  const restLabel = $('#template_rest-label').content.cloneNode(true).children[0];
  restLabel.querySelector('.rest-label__item--name').innerText = currentLabelName;
  restLabel.style.setProperty('--clr-rest-label', labelColor);
  $('.edit__kanban__rest-labels').append(restLabel);

  restLabel.parentElement.scrollLeft = restLabel.parentElement.scrollWidth;
  currentLabel.remove();
})
// kanban item add rest label
addGlobalEventListener('click', '[data-kanban-edit-rest-label-add]',
e => {
  const currentLabel = e.target.parentElement;
  const currentLabelName = e.target.previousElementSibling.innerText;
  const labelColor = getComputedStyle(currentLabel).getPropertyValue('--clr-rest-label') || '#00AEFF';

  const existingLabel = $('#template_existing-label').content.cloneNode(true).children[0];
  existingLabel.querySelector('.existing-label__item--name').innerText = currentLabelName;
  existingLabel.style.setProperty('--clr-existing-label', labelColor);
  $('.edit__kanban__existing-labels').append(existingLabel);

  existingLabel.parentElement.scrollLeft = existingLabel.parentElement.scrollWidth;
  currentLabel.remove();
})


// kanban delete option
addGlobalEventListener('click', '[data-kanban-item-option="delete"]', e => {
  const kanbanSection = e.target.closest('.kanban-section').dataset.kanbanSection;
  const kanbanItem = e.target.closest('.kanban-list__item');
  const formAction = `${kanbanSection}/delete/${kanbanItem.dataset.kanbanItemId}`; 
  $('.delete__kanban').setAttribute('action', formAction);

  document.body.dataset.scrolly = 'false';
  $('[data-kanban-delete-modal]').showModal();
})
addGlobalEventListener('click', '[data-kanban-delete-modal-close]', e => {
  $('.delete__kanban').setAttribute('action', '');
  
  document.body.dataset.scrolly = 'true';
  $('[data-kanban-delete-modal]').close()
})


// create/edit kanban form submit
addGlobalEventListener('submit', '.edit__kanban', async e => {
  e.preventDefault();
  const url = `${location.href}/${e.target.getAttribute('action').trim()}`;

  const kanbanTitle = e.target.querySelector('[data-kanban-edit-title]').value.trim();
  const kanbanDescription = e.target.querySelector('[data-kanban-edit-description]').value.trim();
  const kanbanLabels = [...$$('.existing-label__item')].map(i => {
    return {
      name: i.querySelector('.existing-label__item--name').textContent.trim(),
      color: getComputedStyle(i).getPropertyValue('--clr-existing-label')
    }
  })
  const kanbanItemInfo = {
    kanbanTitle,
    kanbanDescription,
    kanbanLabels
  };

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kanbanItemInfo)
    })

    if(resp.redirected === true) {
      location.reload();
      return;
    } 
    const data = await resp.json();
    if(data.redirectTo == null) return;
    location.href = data.redirectTo;

  } catch (err) {
    console.log(err.message);
  }
})

// delete kanban form submit
addGlobalEventListener('submit', '.delete__kanban', async e => {
  e.preventDefault();
  const url = `${location.href}/${e.target.getAttribute('action')}`; 
  console.log(url);

  try {
    const resp = await fetch(url, { method: 'POST' });
    
    if(resp.redirected === true) {
      location.reload();
      return;
    } 
    const data = await resp.json();
    if(data.redirectTo == null) return;
    location.href = data.redirectTo;

  } catch (err) {
    console.log(err.message);
  }
})

//----</profy_kanban section>

// /project/175437521742/kanban/todo/create 
// /project/175437521742/kanban/todo/edit/8647264 : 8647264 is kanban item id

