const Users = require('../models/Users');

const pageInfo = {
  section: 'home',
  subSection: null, contentEditable: true,

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
      
      if (timeLeft <= 7 || timeLeft <= 15 || timeLeft <= 30) return item;
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
    
    const allProjects = (await foundUser.populate({ 
      path: 'projects', select: 'projectOverview',
      options: { sort: { '_id': -1 } }
    })).projects;
    
    const allLabels = (await foundUser.populate({ 
      path: 'labels', options: { sort: { '_id': -1 } }
    })).labels;
    
    pageInfo.allProjects = [...allProjects];
    pageInfo.allLabels = [...allLabels];

    const dueProjects = await getDueProjects(allProjects);
    pageInfo.dueProjects = (dueProjects.length>0) ? dueProjects : null;

    res.render('main', { pageInfo });
    
  } catch (err) {
    pageInfo.dueProjects = null;
    res.render('main', { pageInfo });
  }
}


module.exports = { getHome }
