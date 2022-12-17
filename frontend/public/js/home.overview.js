import { $, $$, addGlobalEventListener, elaspedTime, workCompleted  } from './utility.js';

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
addGlobalEventListener('click', '[data-overview-edit-btn]', e => {
  const inputField = e.target.parentElement.previousElementSibling.lastElementChild;
  for(const item of $$('[data-overview-field]')) {
    item.setAttribute('readonly', '');
  }
  inputField.removeAttribute('readonly');
  (inputField.getAttribute('type') === 'date') ? inputField.showPicker() : inputField.focus();
  for(const item of $$('.overview__change-btn')) {
    item.classList.remove('edit');
  }
  const parentEl = e.target.parentElement;
  parentEl.classList.add('edit');
  
  const changedElementName = inputField.dataset.overviewField;
  $('.section--overview__form').dataset.overviewFieldChange = changedElementName;
})

addGlobalEventListener('click', '[data-overview-cancel-btn]', e => {
  const inputField = e.target.parentElement.previousElementSibling.lastElementChild;
  inputField.setAttribute('readonly', '');
  inputField.blur();

  $('.section--overview__form').dataset.overviewFieldChange = '';
  const parentEl = e.target.parentElement;
  parentEl.classList.remove('edit');
})


// edit overview form
$('.section--overview__form').addEventListener('submit', async e => {
  e.preventDefault();
  const changedElementName = e.target.dataset.overviewFieldChange;
  const formAction = `${location.href}/edit/${changedElementName}`;
  const changedElement = e.target.querySelector(`[data-overview-field="${changedElementName}"]`);
  const changedElementValue = (changedElement.type !== "textarea") ? changedElement.value.trim() : changedElement.textContent.trim();

  try {
    const resp = await fetch(formAction, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ changedElementValue })
    })

    console.log('req sent \n', resp);
    // location.reload();

  } catch (err) {
    console.log(err.message);
  }
})



$('[data-overview-field="startDate"]').addEventListener('change', e => {
  $('[data-overview-field="endDate"]').setAttribute('min', e.target.value);
})

$('[data-overview-field="endDate"]').addEventListener('change', e => {
  $('[data-overview-field="startDate"]').setAttribute('max', e.target.value);
})


//----</profy_overview section>


// overview timeElasped & workDone 
window.addEventListener('load', () => {
  // Time Elasped
  const eT = elaspedTime(
    $('[data-overview-field="endDate"]').value,
    $('[data-overview-field="startDate"]').value
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

