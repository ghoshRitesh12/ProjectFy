const Users = require('../models/Users');

const pageInfo = {
  section: 'home',
  subSection: null,

  project: null, projectId: null, dueProjects: null,

  allProjects: null, allLabels: null,
  userName: null, theme: null, profilePic: null
};

const userFields = ['name', 'userTheme', 'profileImg', 'projects', 'labels'];

function getDueProjects(projects) {
  return new Promise((resolve, reject) => {
    const DAY_IN_MS = (24 * 60 * 60 * 1000);
    const todaysDate = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    const today = new Date(todaysDate).getTime();
    
    const dueProjects = projects.filter(item => {
      const endDate = item.projectOverview.endDate;
      const dueTime = new Date(endDate).getTime();
      const timeLeft = (dueTime - today) / DAY_IN_MS;
      
      if (timeLeft <= 7 || timeLeft <= 15) return item;
    });
    
    (dueProjects.length>0) ? resolve([...dueProjects]) : reject('No due projects');

  })
}


const getHome = async (req, res) => {
  const userId = req.uuid;
  
  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);
    
    pageInfo.theme = foundUser.userTheme;
    pageInfo.profilePic = foundUser.profileImg;
    pageInfo.userName = foundUser.name;
    
    
    const allProjects = (await foundUser.populate('projects', 'projectOverview')).projects;
    const allLabels = (await foundUser.populate('labels')).labels;
    
    pageInfo.allProjects = [...allProjects];
    pageInfo.allLabels = [...allLabels];

    const dueProjects = await getDueProjects(allProjects);
    pageInfo.dueProjects = dueProjects;

    res.render('main', { pageInfo });
    
  } catch (err) {
    console.log(err);
    res.render('main', { pageInfo });
  }
}


module.exports = { getHome }
