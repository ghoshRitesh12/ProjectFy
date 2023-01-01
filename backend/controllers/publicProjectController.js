const Projects = require('../models/Projects');
const Users = require('../models/Users');

const pageInfo = {
  section: 'project',
  subSection: null, contentEditable: false,

  project: null, projectId: null, dueProjects: null,

  allProjects: null, allLabels: null,
  userName: null, theme: null, profilePic: null
};

const allSubSections = ['overview', 'ideas', 'kanban'];


// '/public/project/:projectID/:subSection'
const getPublicProject = async (req, res) => {
  const { projectID, subSection } = req.params;

  if(!allSubSections.includes(subSection)) return res.render('404');
  pageInfo.subSection = subSection;
  pageInfo.projectId = projectID;

  const populateSubSection = `project${subSection.replace(subSection[0], subSection[0].toUpperCase())}`;

  const projectFields = ['projectOverview', 'isPublic', 'createdBy', populateSubSection];

  try {
    const foundProject = await Projects.findById(projectID, [...new Set(projectFields)]);

    if(!foundProject) return res.render('404');
    if(foundProject.isPublic !== true) {
      res.render('404');
      return;
    }

    pageInfo.project = [foundProject];

    if(populateSubSection === 'projectKanban') {
      const project = (await foundProject.populate({ path: 'projectKanban.labels' }));
      pageInfo.project = [project];
    }

    pageInfo.theme = 'dark';
    
    res.render('main', { pageInfo });
    
  } catch (err) {
    console.log(err);
    res.render('404');
  }
}

module.exports = { getPublicProject };
