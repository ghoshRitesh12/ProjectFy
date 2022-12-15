const Users = require('../models/Users');
const Projects = require('../models/Projects');

const pageInfo = {
  
};

const getProject = async (req, res) => {
  try {
    const uid = req.uuid;
    const { projectId } = req.params;
    const user = await Users.findOne({ uuid: uid });
    // const project = await user.populate('projects').findById(projectId);

    const newP = await Projects.create({ createdBy: 'Ritesh G' });

    console.log(newP);
    res.json({ newP });
  } catch (err) {
    
  }
}

module.exports = { getProject };
