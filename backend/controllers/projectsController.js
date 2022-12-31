const Users = require('../models/Users');
const Projects = require('../models/Projects');

const pageInfo = {
  section: 'projects',
  subSection: null, contentEditable: true,

  project: null, projectId: null, dueProjects: null,

  allProjects: null, allLabels: null,
  userName: null, theme: null, profilePic: null
};

const userFields = ['name', 'userTheme', 'profileImg', 'projects'];

// /projects -for mobile
const getAllProjects = async (req, res) => {
  const userId = req.uuid;
  
  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);
    const allProjects = (await foundUser.populate('projects')).projects;
    
    pageInfo.allProjects = ([...allProjects].length>0) ? [...allProjects] : null;
    pageInfo.theme = foundUser.userTheme;
    pageInfo.profilePic = foundUser.profileImg;
    pageInfo.userName = foundUser.name;

    res.render('main', { pageInfo });

  } catch (err) {
    console.log(err);
  }
}


const createProject = async (req, res) => {
  const userId = req.uuid;
  const { projectName, projectStartDate } = req.body;

  try {
    const foundUser = await Users.findOne({ uuid: userId });

    const newProjectInfo = {
      createdBy: foundUser.name,
      projectOverview: {
        name: projectName,
        startDate: projectStartDate
      }
    };
    const newProject = await Projects.create(newProjectInfo);

    const existingProjects = [...foundUser.projects];
    const allProjects = [...existingProjects, newProject._id];
    foundUser.projects = allProjects;
    await foundUser.save();

    return res.status(201).json({
      'status': 'ok',
      'msg': 'project created successfully',
      'redirectTo': `/project/${newProject._id}/overview`
    });

  } catch (err) {
    console.log(err);
    res.json({
      'status': 'not ok',
      'msg': 'project creation unsuccessfull',
      'redirectTo': null
    });
  }
}

const deleteProject = async (req, res) => {
  const userId = req.uuid;
  const { projectID } = req.params;
  // const projectID = '63a3fe179271da597ce48701';

  try {
    const foundUser = await Users.findOne({ uuid: userId });

    const existingProjects = foundUser.projects.map(i => `${i._id}`);
    const filteredProjects = existingProjects.filter(proId => proId !== projectID);

    foundUser.projects = filteredProjects;
    await foundUser.save();
    await Projects.deleteOne({ _id: projectID });    

    return res.json({
      'status': 'ok',
      'msg': 'project deletion successful',
      'redirectTo': '/'
    });

  } catch (err) {
    console.log(err);
    res.json({
      'status': 'not ok',
      'msg': 'project deletion unsuccessful',
      'redirectTo': null
    });
  }
}


const genShareLink = async (req, res) => {
  const { projectID } = req.params;

  try {
    const foundProject = await Projects.findById(projectID);

    if(foundProject.isPublic === true) {
      res.status(200).json({
        'status': 'ok',
        'msg': `${req.protocol}://${req.get('host')}/public/project/${projectID}`
      });
      return;
    }
    
    foundProject.isPublic = true;
    await foundProject.save();

    res.status(200).json({
      'status': 'ok',
      'msg': `${req.protocol}://${req.get('host')}/public/project/${projectID}`
    });

  } catch (err) {
    res.json({
      'status': 'not ok',
      'msg': 'Error occured, try again'
    });
  }
}

const makeShareLinkPrivate = async (req, res) => {
  const { projectID } = req.params;

  try {
    const foundProject = await Projects.findById(projectID);

    if(foundProject.isPublic === false) {
      res.status(200).json({
        'status': 'ok',
        'msg': 'Link invalidated'
      });
      return;
    }
    
    foundProject.isPublic = false;
    await foundProject.save();

    res.status(200).json({
      'status': 'ok',
      'msg': 'Link invalidated'
    });

  } catch (err) {
    res.json({
      'status': 'not ok',
      'msg': 'Error occured, try again'
    });
  }
}

module.exports = { getAllProjects, createProject, deleteProject, genShareLink, makeShareLinkPrivate };
