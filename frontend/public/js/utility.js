const $ = a => document.querySelector(a);
const $$ = bb => document.querySelectorAll(bb);

function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, e => { 
    if(e.target.matches(selector)) callback(e) 
  });
}

const randomBoxClr = () => {
  // const hue = Math.floor(Math.random() * 180) + 170; 
  const hue = Math.floor(Math.random() * 220) + 180; 
  return `hsl(${hue}, 64%, 60%)`;
}

export { $, $$, addGlobalEventListener, randomBoxClr };
