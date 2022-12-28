const Users = require('../models/Users');
const Labels = require('../models/Labels');

const pageInfo = {
  section: 'labels',
  subSection: null,

  project: null, projectId: null, dueProjects: null,

  allProjects: null, allLabels: null,
  userName: null, theme: null, profilePic: null
};

const userFields = ['name', 'userTheme', 'profileImg', 'labels'];

// /labels -for mobile
const getAllLabels = async (req, res) => {
  const userId = req.uuid;

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);
    const allLabels = (await foundUser.populate('labels')).labels;   
    
    pageInfo.allLabels = [...allLabels];
    pageInfo.theme = foundUser.userTheme;
    pageInfo.profilePic = foundUser.profileImg;
    pageInfo.userName = foundUser.name;

    return res.render('main', { pageInfo });

  } catch (err) {
    console.log(err);
  }
}


const createLabel = async (req, res) => {
  const userId = req.uuid;
  const { labelName, labelColor } = req.body;

  try {
    const foundUser = await Users.findOne({ uuid: userId });

    const newLabelInfo = { 
      name: labelName, 
      color: labelColor 
    };
    const newLabel = await Labels.create(newLabelInfo);

    const existingLabels = [...foundUser.labels];
    const allLabels = [...existingLabels, newLabel._id];
    foundUser.labels = allLabels;
    await foundUser.save();

    res.status(201).json({
      'status': 'ok',
      'msg': 'label creation successful',
      'redirectTo': null
    })

  } catch (err) {
    res.json({
      'status': 'not ok',
      'msg': 'label creation unsuccesful',
      'redirectTo': null
    })
  }
}

const deleteLabel = async (req, res) => {
  const userId = req.uuid;
  const { labelID } = req.params;
  // const labelID = '63a481d7c640e30b12e396d3';

  try {
    const foundUser = await Users.findOne({ uuid: userId });

    const existingLabels = foundUser.labels.map(i => `${i._id}`);
    const filteredLabels = existingLabels.filter(labelId => labelId !== labelID);

    foundUser.labels = filteredLabels;
    await foundUser.save();
    await Labels.deleteOne({ _id: labelID });

    return res.json({
      'status': 'ok',
      'msg': 'label deletion successful',
      'redirectTo': null
    })

  } catch (err) {
    console.log(err);
    res.json({
      'status': 'not ok',
      'msg': 'label deletion unsuccesful',
      'redirectTo': null
    })
  }
}


module.exports = { getAllLabels, createLabel, deleteLabel };
