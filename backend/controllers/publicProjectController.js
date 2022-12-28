const Projects = require('../models/Projects');
const Users = require('../models/Users');

const pageInfo = {
  projectId: null,
  subSection: null,
  optionsAvailable: false
};


// '/project/:projectID/:subSection'
const getPublicProject = async (req, res) => {
  const userId = req.uuid;
  const { projectID, subSection } = req.params;
  pageInfo.projectId = projectID;
  pageInfo.subSection = subSection;

  try {
    const foundProject = await Projects.findById(projectID);
    if(foundProject.isPublic !== true) {
      res.render('404');
      return;
    }

    // return res.json({
    //   pageInfo,
    //   foundProject,
    //   userId
    // });
    res.json({ pageInfo, foundProject });

  } catch (err) {
    console.log(err);
    res.redirect('back');
  }
}

module.exports = { getPublicProject };
