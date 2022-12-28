const Users = require('../models/Users');

const pageInfo = {
  section: 'home',
  subSection: null,

  project: null, projectId: null, dueProjects: null,

  allProjects: null, allLabels: null,
  userName: null, theme: null, profilePic: null
};

const userFields = ['name', 'userTheme', 'profileImg', 'projects', 'labels'];

const getHome = async (req, res) => {
  const uuid = req.uuid;
  
  try {
    const foundUser = await Users.findOne({ uuid: uuid }, userFields);
    const allProjects = (await foundUser.populate('projects', 'projectOverview')).projects;
    const allLabels = (await foundUser.populate('labels')).labels;

    pageInfo.allProjects = [...allProjects];
    pageInfo.allLabels = [...allLabels];
    pageInfo.theme = foundUser.userTheme;
    pageInfo.profilePic = foundUser.profileImg;
    pageInfo.userName = foundUser.name;

    // console.log(pageInfo);

    res.render('main', { pageInfo });

  } catch (err) {
    console.log(err.message);
    res.redirect('/');
  }
}

// function getDueProjects() {
// }

module.exports = { getHome }
