const Users = require('../models/Users');

const userFields = ['projects'];

const modifyOverview = async (req, res) => {
  const userId = req.uuid;
  const { projectID, changedElementName } = req.params;
  const { changedElementValue } = req.body;

  const fieldToChange = `projectOverview.${changedElementName}`;

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);
    
    if(![...foundUser.projects].map(i => `${i._id}`).includes(projectID)) {
      res.json({
        'status': 'not ok',
        'msg': `couldn't change overview field`,
        'redirectTo': null
      })
      return;
    }

    const project = (await foundUser.populate({ 
      path: 'projects', select: fieldToChange, match: { _id: projectID } 
    })).projects[0];
    
    project.projectOverview[changedElementName] = changedElementValue;
    await project.save();    

    res.json({
      'status': 'ok',
      'msg': `Modified ${changedElementName.toLowerCase()} value`,
      'redirectTo': null
    })

  } catch (err) {
    console.log(err);
    res.json({
      'status': 'not ok',
      'msg': `Couldn't modify ${changedElementName.toLowerCase()}`,
      'redirectTo': null
    })
  }
}


module.exports = { modifyOverview };
