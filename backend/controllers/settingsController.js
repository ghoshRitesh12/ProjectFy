const Users = require('../models/Users');
const Projects = require('../models/Projects');
const cloudinary = require('cloudinary').v2;

const pageInfo = {
  section: 'profile-settings',
  subSection: null,

  project: null, projectId: null, dueProjects: null,

  allProjects: null, allLabels: null,
  userName: null, theme: null, profilePic: null, userEmail: null
};

const userFields = [
  'name', 'userTheme', 'profileImg', 'email',  //email field for settings page
  'projects', 'labels'
];

const getProfileSettings = async (req, res) => {
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
    pageInfo.userEmail = foundUser.email;


    res.render('main', { pageInfo });

  } catch (err) {
    console.log(err.message);
    res.redirect('/');
  }
}

const profileNameChange = async (req, res) => {
  const userId = req.uuid;

  try {
    const { changedName } = req.body;
    if(!changedName) throw new Error('changed name not present');

    const foundUser = await Users.findOne({ uuid: userId }, 'name');
    if(!foundUser) {
      res.json({
        'status': 'ok',
        'msg': 'Profile name update failed',
        'redirectTo': null
      })
      return;
    }

    foundUser.name = changedName.trim();
    await foundUser.save();

    res.json({
      'status': 'ok',
      'msg': `Updated profile name`,
      'redirectTo': null
    })

  } catch (err) {
    console.log(err.message); 
    res.json({
      'status': 'not ok',
      'msg': 'Profile name update failed',
      'redirectTo': null
    })
  }
}

const deleteAccount = async (req, res) => {
  const userId = req.uuid;
  
  const deletionFields = ['profileImg', 'projects', 'labels'];

  try {
    const foundUser = await Users.findOne({ uuid: userId }, deletionFields);

    // res.clearCookie(
    //   'refresh_token',
    //   { httpOnly: true }
    // )
    // res.clearCookie(
    //   'access_token',
    //   { httpOnly: true }
    // )
    
    // throw new Error();
    // const allLabels = [...foundUser.labels].map(i => `${i._id}`);
    // console.log(allLabels);
    // await Labels.deleteMany({ _id: { $in: allLabels } });

    // await Users.deleteOne({ uuid: userId });

    res.json({
      'status': 'not ok',
      'msg': 'Account deleted',
      'redirectTo': '/'
    })


    // send req to an ur api to delete 
      // profile img
      // project's ideas images
      // labels


  } catch (err) {
    console.log(err.message); 
    res.json({
      'status': 'not ok',
      'msg': 'Account deletion failed',
      'redirectTo': null
    })
  }
}

const changeProfilePic = async (req, res) => {
  const userId = req.uuid;
  const { picUrl, picId } = req.body;

  const userFields = ['profileImg', 'profileImgId'];

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);
    if(!foundUser) {
      res.json({
        'status': 'not ok',
        'msg': `Profile pic update failed`,
        'redirectTo': null
      })
      return;
    }

    if(foundUser.profileImgId !== null)
      cloudinary.uploader.destroy(foundUser.profileImgId);

    foundUser.profileImg = picUrl;
    foundUser.profileImgId = picId;
    await foundUser.save();

    res.json({
      'status': 'ok',
      'msg': `Profile pic updated`,
      'redirectTo': null
    })

  } catch (err) {
    console.log(err);
    res.json({
      'status': 'not ok',
      'msg': `Profile pic update failed`,
      'redirectTo': null
    })
  }
}

module.exports = { getProfileSettings, profileNameChange, deleteAccount, changeProfilePic };
