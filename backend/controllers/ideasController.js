const Users = require('../models/Users');
const Projects = require('../models/Projects');
const cloudinary = require('cloudinary').v2;

const userFields = ['projects'];


const createIdea = async (req, res) => {
  const userId = req.uuid;
  const { projectID } = req.params;

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);

    if(![...foundUser.projects].map(i => `${i._id}`).includes(projectID)) {
      res.json({
        'status': 'not ok',
        'msg': "Couldn't create idea",
        'redirectTo': null
      })
      return;
    }

    const ideaItemInfo = {
      date: req.body.creationDate,
      description: req.body.ideaDescription,
      isImgAUrl: req.body.isImgAUrl,
      imgUrl: req.body.imgUrl,
      imgUpload: req.body.imgUpload,
      hostedImgId: req.body.hostedImgId
    };

    const foundProject = await Projects.findById(projectID, 'projectIdeas');

    const existingIdeas = [...foundProject.projectIdeas];
    const allIdeas = [...existingIdeas, ideaItemInfo];
    foundProject.projectIdeas = allIdeas.sort((a, b) => (`${a._id}` > `${b._id}` ? -1 : 1));    
    await foundProject.save();

    res.json({
      'status': 'ok',
      'msg': "Created idea",
      'redirectTo': null
    })
    
  } catch (error) {
    res.json({
      'status': 'not ok',
      'msg': "Couldn't create idea",
      'redirectTo': null
    })
  }
}

const editIdea = async (req, res) => {
  const userId = req.uuid;
  const { projectID, ideaID } = req.params;

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);

    if(![...foundUser.projects].map(i => `${i._id}`).includes(projectID)) {
      res.json({
        'status': 'not ok',
        'msg': `Couldn't modify idea`,
        'redirectTo': null
      })
      return;
    }

    const foundProject = await Projects.findById(projectID, 'projectIdeas');
    const foundProjectIdea = foundProject.projectIdeas.find(item => `${item._id}` === ideaID);

    if(foundProjectIdea == null) {
      res.json({
        'status': 'not ok',
        'msg': "Couldn't modify idea",
        'redirectTo': null
      })
      return;
    }

    foundProjectIdea.description = req.body.ideaDescription;
    foundProjectIdea.imgUrl = req.body.imgUrl;
    await foundProject.save();


    res.json({
      'status': 'ok',
      'msg': `Modified idea`,
      'redirectTo': null
    })


  } catch (err) {
    console.log(err.message);
    res.json({
      'status': 'not ok',
      'msg': `Couldn't modify idea`,
      'redirectTo': null
    })
  }
}

const deleteIdea = async (req, res) => {
  const userId = req.uuid;
  const { projectID, ideaID } = req.params;

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);

    if(![...foundUser.projects].map(i => `${i._id}`).includes(projectID)) {
      res.json({
        'status': 'not ok',
        'msg': `Couldn't delete idea`,
        'redirectTo': null
      })
      return;
    }

    const foundProject = await Projects.findById(projectID, 'projectIdeas');

    const foundProjectIdea = foundProject.projectIdeas.find(item => `${item._id}` === ideaID);
    if(foundProjectIdea == null) {
      res.json({
        'status': 'not ok',
        'msg': "Couldn't delete idea",
        'redirectTo': null
      })
      return;
    }

    if(foundProjectIdea.isImgAUrl === false) 
      cloudinary.uploader.destroy(foundProjectIdea.hostedImgId);


    const filteredIdeas = foundProject.projectIdeas.filter(item => `${item._id}` !== ideaID);
    foundProject.projectIdeas = [...filteredIdeas];
    await foundProject.save();


    res.json({
      'status': 'ok',
      'msg': `Deleted idea`,
      'redirectTo': null
    })


  } catch (err) {
    console.log(err);
    res.json({
      'status': 'not ok',
      'msg': `Couldn't delete idea`,
      'redirectTo': null
    })
  }
}


module.exports = { createIdea, deleteIdea, editIdea };
