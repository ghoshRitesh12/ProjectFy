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

const elaspedTime = (endDate, startDate) => {
  const aDayInMs = (24 * 60 * 60 * 1000);
  const todaysDate = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
  console.log('Start Date:', startDate,'\nEnd Date:', endDate);

  const endDInMs = new Date(endDate).getTime();
  let startDInMs = new Date(startDate).getTime();
  let todayDInMs = new Date(todaysDate).getTime();

  const totalTimeDiff = endDInMs - startDInMs;
  const totalDays = totalTimeDiff / aDayInMs;
  if(startDInMs > endDInMs)
    startDInMs = endDInMs;

  if(todayDInMs > endDInMs)
    todayDInMs = endDInMs;
  const currentTimeDiff = todayDInMs - startDInMs;
  const daysPassed = currentTimeDiff / aDayInMs;

  const daysLeft = totalDays - daysPassed;
  const timeElasped = Math.round((daysPassed / totalDays) * 100) || 0;

  console.log('%s days total', totalDays);
  console.log('%s days passed', daysPassed)
  console.log('%s day(s) left', daysLeft)
  console.log('time elasped: %f%', timeElasped);
  

  return {
    time: timeElasped,
    days: daysLeft
  };
}


const workCompleted = (completedTasks, totalTasks) => {

  const workDone = Math.round((completedTasks / totalTasks) * 100);
  const tasksLeft = totalTasks - completedTasks;

  return {
    work: workDone,
    tasks: tasksLeft
  };
}

export { $, $$, addGlobalEventListener, randomBoxClr, elaspedTime, workCompleted };
