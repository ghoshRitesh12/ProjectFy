import { $, $$, addGlobalEventListener } from './utility.js';

//----<profy_kanban section>

addGlobalEventListener('click', '[data-kanban-item-option-icon]', e => {
  const optionsEl = e.target.nextElementSibling;
  const isOpen = (optionsEl.getAttribute('aria-hidden') === 'true') ? 'false' : 'true';
  optionsEl.setAttribute('aria-hidden', isOpen);
})
addGlobalEventListener('click', '[data-kanban-item-option]', e => {
  const optionsEl = e.target.parentElement;
  optionsEl.setAttribute('aria-hidden', 'true');
})

addGlobalEventListener('click', '[data-kanban-move-to]', e => {
  // send an api req to shift the kanban section
  const sectionToMoveTo = e.target.dataset.kanbanMoveTo;
  console.log(sectionToMoveTo);
  // location.reload();
})

function filterLabels(allLabels, itemLabels) {

}

// edit kanban item
addGlobalEventListener('click', '[data-kanban-item-option="edit"]', e => {
  const kanbanSection = e.target.closest('.kanban-section').dataset.kanbanSection;
  const kanbanItem = e.target.closest('.kanban-list__item');
  const allLabels = [...$$('[data-label-list-item]')].map(j => j.innerText);
  const itemLabels = [...kanbanItem.querySelectorAll('.kanban-item__label')].map(i => i.textContent);
  const restLabels = allLabels.filter(item => !itemLabels.includes(item));

  const formAction = `/${kanbanSection}/edit/${kanbanItem.dataset.kanbanItemId}`; 
  $('.edit__kanban').setAttribute('action', formAction);

  for(const i of itemLabels) {
    const existingLabel = $('#template_existing-label').content.cloneNode(true).children[0];
    existingLabel.querySelector('.existing-label__item--name').innerText = i;
    $('.edit__kanban__existing-labels').append(existingLabel);
  }
  for(const i of restLabels) {
    const restLabel = $('#template_rest-label').content.cloneNode(true).children[0];
    restLabel.querySelector('.rest-label__item--name').innerText = i;
    $('.edit__kanban__rest-labels').append(restLabel);
  }

  const kanbanItemTitle = kanbanItem.querySelector('[data-kanban-title]').innerText;
  const kanbanItemDescription = kanbanItem.querySelector('[data-kanban-description]').innerText;
  $('[data-kanban-edit-title]').value = kanbanItemTitle;
  $('[data-kanban-edit-description]').textContent = kanbanItemDescription;


  // console.log(allLabels);
  // console.log(itemLabels);
  // console.log(restLabels);

  $('[data-kanban-edit-modal]').showModal();
})
addGlobalEventListener('click', '[data-kanban-edit-modal-close]', e => {
  $('.edit__kanban__existing-labels').innerHTML = '';
  $('.edit__kanban__rest-labels').innerHTML = '';
  $('[data-kanban-edit-title]').value = '';
  $('[data-kanban-edit-description]').textContent = '';
  

  $('[data-kanban-edit-modal]').close();
})

// kanban item delete existing label
addGlobalEventListener('click', '[data-kanban-edit-existing-label-delete]',
e => {
  const currentLabel = e.target.parentElement;
  const currentLabelName = e.target.previousElementSibling.innerText;

  const restLabel = $('#template_rest-label').content.cloneNode(true).children[0];
  restLabel.querySelector('.rest-label__item--name').innerText = currentLabelName;
  $('.edit__kanban__rest-labels').append(restLabel);

  currentLabel.remove();
})

// kanban item add rest label
addGlobalEventListener('click', '[data-kanban-edit-rest-label-add]',
e => {
  const currentLabel = e.target.parentElement;
  const currentLabelName = e.target.previousElementSibling.innerText;

  const existingLabel = $('#template_existing-label').content.cloneNode(true).children[0];
  existingLabel.querySelector('.existing-label__item--name').innerText = currentLabelName;
  $('.edit__kanban__existing-labels').append(existingLabel);

  currentLabel.remove();
})



// addGlobalEventListener('click', '[data-kanban-item-option="delete"]', e => {})

// kanban delete option
addGlobalEventListener('click', '[data-kanban-item-option="delete"]', e => $('[data-kanban-delete-modal]').showModal())
addGlobalEventListener('click', '[data-kanban-delete-modal-close]', e => $('[data-kanban-delete-modal]').close())

//----</profy_kanban section>

// /project/175437521742/kanban/todo/create 
// /project/175437521742/kanban/todo/edit/8647264 : 8647264 is kanban item id
