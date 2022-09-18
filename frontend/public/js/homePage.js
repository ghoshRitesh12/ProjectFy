import { $, $$, addGlobalEventListener } from './utility.js';


$('.projectfy__sidepanel__account').addEventListener('click', e => {
  // closing labels dropdown
  if($('.projectfy__sidepanel__nav__list--projects-list').classList.contains('open')) {
    $('.projectfy__sidepanel__nav__list--labels-list').classList.remove('open');
    $('.projectfy__sidepanel__nav__list--labels-wrapper__downarrow-icon').classList.remove('rotated');
  }


  if(!$('.projectfy__sidepanel__preferences').classList.contains('open')) {
    $('.projectfy__sidepanel__preferences').classList.add('open');
    $('.projectfy__sidepanel__account--options').classList.add('rotated');
  }
  else {
    $('.projectfy__sidepanel__preferences').classList.remove('open');
    $('.projectfy__sidepanel__account--options').classList.remove('rotated');
  }
})



// dark mode
addGlobalEventListener('click', '.projectfy__sidepanel__mode--light', e => {
  if($('body').dataset.theme === "dark-mode") 
    $('body').dataset.theme = e.target.dataset.mode;
  

})
addGlobalEventListener('click', '.projectfy__sidepanel__mode--dark', e => {
  if($('body').dataset.theme === "light-mode") 
    $('body').dataset.theme = e.target.dataset.mode;
  
})



// projects nav
$('.projectfy__sidepanel__nav__list--projects-wrapper').addEventListener('click', e => {
  // closing accounts dropdown
  if($('.projectfy__sidepanel__nav__list--labels-list').classList.contains('open')) {
    $('.projectfy__sidepanel__preferences').classList.remove('open');
    $('.projectfy__sidepanel__account--options').classList.remove('rotated');
  }

  if(!$('.projectfy__sidepanel__nav__list--projects-list').classList.contains('open')) {
    $('.projectfy__sidepanel__nav__list--projects-list').classList.add('open');
    e.target.lastElementChild.classList.add('rotated');
  }
  else {
    $('.projectfy__sidepanel__nav__list--projects-list').classList.remove('open');
    e.target.lastElementChild.classList.remove('rotated');
  }
})

// labels nav
$('.projectfy__sidepanel__nav__list--labels-wrapper').addEventListener('click', e => {
  // closing accounts dropdown
  if($('.projectfy__sidepanel__nav__list--projects-list').classList.contains('open')) {
    $('.projectfy__sidepanel__preferences').classList.remove('open');
    $('.projectfy__sidepanel__account--options').classList.remove('rotated');
  }


  if(!$('.projectfy__sidepanel__nav__list--labels-list').classList.contains('open')) {
    $('.projectfy__sidepanel__nav__list--labels-list').classList.add('open');
    e.target.lastElementChild.classList.add('rotated');
  }
  else {
    $('.projectfy__sidepanel__nav__list--labels-list').classList.remove('open');
    e.target.lastElementChild.classList.remove('rotated');
  }
})

// label items
addGlobalEventListener('click', '.projectfy__sidepanel__nav__list--labels-listItem',
e => {
  for(const item of $$('.projectfy__sidepanel__nav__list--labels-listItem')) {
    item.classList.remove('selected');
  }

  e.target.classList.add('selected');

})

// project items
addGlobalEventListener('click', '.projectfy__sidepanel__nav__list--projects-listItem',
e => {
  for(const item of $$('.projectfy__sidepanel__nav__list--projects-listItem')) {
    item.classList.remove('selected');
  }

  e.target.classList.add('selected');

})


// just testing stuff 😅
$('.projectfy__sidepanel__mode--light').addEventListener('click', 
async e => {

  // location.href = "/bruh";
  // try {
  //   const resp = await fetch('/signin');
  //   const data = await resp.text();

  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(data, 'text/html');

  //   console.log(doc);
  //   // $('.projecty__main').innerHTML = doc;
  // } catch (error) {
  //   console.error(error);
  // }
})  
