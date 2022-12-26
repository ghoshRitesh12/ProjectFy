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
  const DAY_IN_MS = (24 * 60 * 60 * 1000);
  const todaysDate = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
  const endDInMs = new Date(endDate).getTime();
  const startDInMs = new Date(startDate).getTime();
  let todayDInMs = new Date(todaysDate).getTime();
  // console.log('Start Date:', startDate,'\nEnd Date:', endDate);

  const totalTimeDiff = endDInMs - startDInMs;
  const totalDays = totalTimeDiff / DAY_IN_MS;
  
  if(startDInMs > todayDInMs) todayDInMs = startDInMs
  if(endDInMs < todayDInMs) todayDInMs = endDInMs
  
  const currentTimeDiff = todayDInMs - startDInMs;
  const daysPassed = currentTimeDiff / DAY_IN_MS;
  const daysLeft = totalDays - daysPassed;
  
  let timeElasped = Math.round((daysPassed / totalDays) * 100);
  timeElasped = isNaN(timeElasped) ? 100 : timeElasped;
  
  // console.log('Total Days ', totalDays);
  // console.log('Days Left ', daysLeft);
  // console.log(`Time Elasped: ${timeElasped}%`);  

  return {
    time: timeElasped,
    days: daysLeft
  };
}


const workCompleted = (completedTasks, totalTasks) => {
  let workDone = Math.round((completedTasks / totalTasks) * 100);
  workDone = isFinite(workDone) ? workDone : 0;
  const tasksLeft = totalTasks - completedTasks;

  return {
    work: workDone,
    tasks: tasksLeft
  };
}


function greetUser() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning 🌞';
  else if (hour >= 12 && hour <= 16) return 'Good Afternoon 🌵';
  else if (hour >= 16 && hour <= 24) return 'Good Evening 🌃';
}

function getHomeDate() {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const d = new Date();
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

const convertDbDate = date => `${date.split('-').reverse().join('-').replace('-', '.')}`;

export { 
  $, $$, addGlobalEventListener, 
  randomBoxClr, elaspedTime, workCompleted, 
  greetUser, getHomeDate, convertDbDate
};

