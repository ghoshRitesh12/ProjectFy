const Users = require('../models/Users');
const Projects = require('../models/Projects');

const pageInfo = {
  section: 'project',
  subSection: null,

  project: null, projectId: null, dueProjects: null,

  allProjects: null, allLabels: null,
  userName: null, theme: null, profilePic: null
};

const allSubSections = ['overview', 'ideas', 'kanban'];
const userFields = ['name', 'userTheme', 'profileImg', 'projects', 'labels'];


// '/project/:projectID/:subSection'
const getProject = async (req, res) => {
  const userId = req.uuid;
  const { projectID, subSection } = req.params;

  if(!allSubSections.includes(subSection)) return res.render('404');
  pageInfo.subSection = subSection;
  pageInfo.projectId = projectID;

  const populateSubSection = `project${subSection.replace(subSection[0], subSection[0].toUpperCase())}`;

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);
    
    const allProjects = (await foundUser.populate({ 
      path: 'projects', 
      select: 'projectOverview.name' 
    })).projects;
    
    if(![...allProjects].map(i => `${i._id}`).includes(projectID)) 
    return res.render('404');
    
    pageInfo.allProjects = [...allProjects];

    const projectFields = ['projectOverview', 'isPublic', 'createdBy', populateSubSection]
    const project = (await foundUser.populate({ 
      path: 'projects', 
      select: [...new Set(projectFields)], 
      match: { _id: projectID } 
    })).projects;
    // console.log(project);

    const allLabels = (await foundUser.populate('labels')).labels;

    pageInfo.project = project;
    pageInfo.allLabels = [...allLabels];
    pageInfo.theme = foundUser.userTheme;
    pageInfo.profilePic = foundUser.profileImg;
    pageInfo.userName = foundUser.name;

    res.render('main', { pageInfo });

  } catch (err) {
    console.log(err);
  }
}


module.exports = { getProject };
