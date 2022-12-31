const Projects = require('../models/Projects');
const Users = require('../models/Users');

const pageInfo = {
  section: 'project',
  subSection: null, contentEditable: false,

  project: null, projectId: null, dueProjects: null,

  allProjects: null, allLabels: null,
  userName: null, theme: null, profilePic: null
};

const userFields = ['name', 'userTheme', 'profileImg', 'projects', 'labels'];

// '/project/:projectID/:subSection'
const getPublicProject = async (req, res) => {
  const userId = req.uuid;
  const { projectID, subSection } = req.params;
  pageInfo.projectId = projectID;
  pageInfo.subSection = subSection;

  res.json({
    'message': 'Happy New Year 2023 💕',
    'context': 'this route is under construction'
  })
  return;

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);

    if(!foundUser) {
      pageInfo.theme = 'dark';
      pageInfo.profilePic = null;
      pageInfo.userName = null;

      pageInfo.allProjects = null;
      pageInfo.allLabels = null;

      const foundProject = await Projects.findById(projectID);
      if(foundProject.isPublic !== true) {
        res.render('404');
        return;
      }

      pageInfo.project = foundProject;

      console.log(pageInfo);

      res.render('main', { pageInfo });
      return;
    }
    
    pageInfo.theme = (foundUser.userTheme != null) ? foundUser.userTheme : 'dark';
    pageInfo.profilePic = (foundUser.profileImg !== null) ? foundUser.foundUser.profileImg : null;
    pageInfo.userName = (foundUser.name !== null) ? foundUser.name : null;

    const allProjects = (await foundUser.populate('projects', 'projectOverview')).projects;
    const allLabels = (await foundUser.populate('labels')).labels;
    
    pageInfo.allProjects = ([...allProjects].length>0) ? [...allProjects] : null;
    pageInfo.allLabels = ([...allLabels].length>0) ? [...allLabels] : null;

    const foundProject = await Projects.findById(projectID);
    if(foundProject.isPublic !== true) {
      res.render('404');
      return;
    }

    pageInfo.project = foundProject;
    console.log(pageInfo);

    res.render('main', { pageInfo });
    
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getPublicProject };
