import { $, $$, addGlobalEventListener } from './utility.js';


$('.projectfy__sidepanel__account').addEventListener('click', e => {
  if(!$('.projectfy__sidepanel__preferences').classList.contains('open')) {
    $('.projectfy__sidepanel__preferences').classList.add('open');
    $('.projectfy__sidepanel__account--options').style.transform = "rotate(180deg)";
  }
  else {
    $('.projectfy__sidepanel__preferences').classList.remove('open');
    $('.projectfy__sidepanel__account--options').style.transform = "rotate(0deg)";
  }

})

addGlobalEventListener('click', '.projectfy__sidepanel__mode__LD', e => {
  e.target.parentElement.classList.replace(e.target.parentElement.classList[1], e.target.dataset.mode);
})


