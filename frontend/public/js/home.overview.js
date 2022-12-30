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
addGlobalEventListener('submit', '.section--overview__form', async e => {
  e.preventDefault();
  const changedElementName = e.target.dataset.overviewFieldChange;
  const formAction = `${location.href}/edit/${changedElementName}`;
  const changedElement = e.target.querySelector(`[data-overview-field="${changedElementName}"]`);
  // const changedElementValue = (changedElement.type !== "textarea") ? changedElement.value.trim() : changedElement.textContent.trim();
  const changedElementValue = changedElement.value.trim();

  try {
    const resp = await fetch(formAction, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ changedElementValue })
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
    location.reload();
    console.log(err.message);
  }
})



addGlobalEventListener('change', '[data-overview-field="startDate"]', e => {
  $('[data-overview-field="endDate"]').setAttribute('min', e.target.value);
})

addGlobalEventListener('change', '[data-overview-field="endDate"]', e => {
  $('[data-overview-field="startDate"]').setAttribute('max', e.target.value);
})


//----</profy_overview section>


// overview timeElasped & workDone 
window.addEventListener('load', () => {
  // Time Elasped

  if($('.profy__main__section--overview') !== null) {
    const eT = elaspedTime(
      $('[data-overview-field="endDate"]').value,
      $('[data-overview-field="startDate"]').value
    );
    $('[data-time-progress-value]').innerText = eT.time;
    $('.circleThumb--time').style.setProperty('--value', eT.time);
    $('[data-time-progress-daysLeft]').innerText = eT.days;
  }


  if($('.profy__main__section--overview') !== null) {
    // Work Completed: complete-45 total-70
    const completedTasks = $('[data-work-progress]').dataset.workProgress.split(",")[0];
    const totalTasks = $('[data-work-progress]').dataset.workProgress.split(",")[1];

    const work = workCompleted(completedTasks, totalTasks);
    $('[data-work-progress-value]').innerText = work.done;
    $('.circleThumb--work').style.setProperty('--value', work.done);
    $('[data-work-progress-daysLeft]').innerText = work.left;
  }
})

