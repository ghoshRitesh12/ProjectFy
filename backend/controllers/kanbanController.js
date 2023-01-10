const Users = require('../models/Users');
const Projects = require('../models/Projects');

const userFields = ['projects'];

async function calcAndSetTasks(projectId) {
  try {
    const foundProject = await Projects.findById(projectId, ['projectOverview', 'projectKanban']);

    const todoKanbans = foundProject.projectKanban.filter(i => i.category === "todo");
    const inProgressKanbans = foundProject.projectKanban.filter(i => i.category === "inProgress");
    const completedKanbans = foundProject.projectKanban.filter(i => i.category === "completed");

    const completedTasks = completedKanbans.length;
    const totalTasks = (todoKanbans.length + inProgressKanbans.length + completedKanbans.length);

    foundProject.projectOverview.totalTasks = totalTasks;
    foundProject.projectOverview.completedTasks = completedTasks;
    
    await foundProject.save();

  } catch (err) {
    console.log(err);
  }
}

const createKanban = async (req, res) => {
  const userId = req.uuid;
  const { projectID, kanbanSection } = req.params;

  if(!['todo', 'inProgress', 'completed'].includes(kanbanSection)) {
    res.json({
      'status': 'not ok',
      'msg': `Couldn't create kanban item`,
      'redirectTo': null
    })
    return;
  }

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);

    if(![...foundUser.projects].map(i => `${i._id}`).includes(projectID)) {
      res.json({
        'status': 'not ok',
        'msg': `Couldn't create kanban item`,
        'redirectTo': null
      })
      return;
    }

    const kanbanItemInfo = {
      // id: require('crypto').randomBytes(5).toString('hex'),
      category: kanbanSection,
      title: req.body.kanbanTitle,
      description: req.body.kanbanDescription,
      labels: req.body.kanbanLabels
    }

    const foundProject = await Projects.findById(projectID, 'projectKanban');

    const existingKanbans = [...foundProject.projectKanban];
    const allKanbans = [...existingKanbans, kanbanItemInfo];
    foundProject.projectKanban = allKanbans.sort((a, b) => (`${a._id}` > `${b._id}` ? -1 : 1));    
    await foundProject.save();

    console.log(allKanbans);

    res.json({
      'status': 'ok',
      'msg': `Created kanban item`,
      'redirectTo': null
    })
    
    await calcAndSetTasks(projectID);

  } catch (err) {
    console.log(err);
    res.json({
      'status': 'not ok',
      'msg': `Couldn't create kanban item`,
      'redirectTo': null
    })
  }
}

const editKanban = async (req, res) => {
  const userId = req.uuid;
  const { projectID, kanbanSection, kanbanID } = req.params;

  if(!['todo', 'inProgress', 'completed'].includes(kanbanSection)) {
    res.json({
      'status': 'not ok',
      'msg': `Couldn't modify kanban item`,
      'redirectTo': null
    })
    return;
  }

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);

    if(![...foundUser.projects].map(i => `${i._id}`).includes(projectID)) {
      res.json({
        'status': 'not ok',
        'msg': `Couldn't modify kanban item`,
        'redirectTo': null
      })
      return;
    }

    const foundProject = await Projects.findById(projectID, 'projectKanban');
    const foundProjectKanban = foundProject.projectKanban.find(item => `${item._id}` === kanbanID);

    if(foundProjectKanban == null) {
      res.json({
        'status': 'not ok',
        'msg': `Couldn't modify kanban item`,
        'redirectTo': null
      })
      return;
    }

    foundProjectKanban.title = req.body.kanbanTitle;
    foundProjectKanban.description = req.body.kanbanDescription;
    foundProjectKanban.labels = req.body.kanbanLabels;
    await foundProject.save();
    
    res.json({
      'status': 'ok',
      'msg': `Modified kanban item`,
      'redirectTo': null
    })
    
    await calcAndSetTasks(projectID);

  } catch (err) {
    console.log(err.message);
    res.json({
      'status': 'not ok',
      'msg': `Couldn't modify kanban item`,
      'redirectTo': null
    })
  }
}

const deleteKanban = async (req, res) => {
  const userId = req.uuid;
  const { projectID, kanbanSection, kanbanID } = req.params;

  if(!['todo', 'inProgress', 'completed'].includes(kanbanSection)) {
    res.json({
      'status': 'not ok',
      'msg': `Couldn't delete kanban item`,
      'redirectTo': null
    })
    return;
  }

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);

    if(![...foundUser.projects].map(i => `${i._id}`).includes(projectID)) {
      res.json({
        'status': 'not ok',
        'msg': `Couldn't delete kanban item`,
        'redirectTo': null
      })
      return;
    }

    const foundProject = await Projects.findById(projectID, 'projectKanban');

    const foundProjectKanban = foundProject.projectKanban.find(item => `${item._id}` === kanbanID);
    if(foundProjectKanban == null) {
      res.json({
        'status': 'not ok',
        'msg': `Couldn't delete kanban item`,
        'redirectTo': null
      })
      return;
    }

    const filteredKanbans = foundProject.projectKanban.filter(item => `${item._id}` !== kanbanID);
    foundProject.projectKanban = [...filteredKanbans];
    await foundProject.save();

    res.json({
      'status': 'ok',
      'msg': `Deleted kanban item`,
      'redirectTo': null
    })
    
    await calcAndSetTasks(projectID);

  } catch (err) {
    console.log(err.message);
    res.json({
      'status': 'not ok',
      'msg': `Couldn't delete kanban item`,
      'redirectTo': null
    })
  }

}

const shiftKanban = async (req, res) => {
  const userId = req.uuid;
  const { projectID, kanbanSection, kanbanID } = req.params;
  const { sectionToMoveTo } = req.body;

  if(!['todo', 'inProgress', 'completed'].includes(kanbanSection) || 
    !['todo', 'inProgress', 'completed'].includes(sectionToMoveTo)) {
    res.json({
      'status': 'not ok',
      'msg': `Couldn't shift kanban item`,
      'redirectTo': null
    })
    return;
  }

  try {
    const foundUser = await Users.findOne({ uuid: userId }, userFields);

    if(![...foundUser.projects].map(i => `${i._id}`).includes(projectID)) {
      res.json({
        'status': 'not ok',
        'msg': `Couldn't shift kanban item`,
        'redirectTo': null
      })
      return;
    }

    const foundProject = await Projects.findById(projectID, 'projectKanban');
    const foundProjectKanban = foundProject.projectKanban.find(item => `${item._id}` === kanbanID);
    if(foundProjectKanban == null) {
      res.json({
        'status': 'not ok',
        'msg': `Couldn't shift kanban item`,
        'redirectTo': null
      })
      return;
    }

    foundProjectKanban.category = sectionToMoveTo;
    await foundProject.save();

    res.json({
      'status': 'ok',
      'msg': `Shifted kanban item`,
      'redirectTo': null
    })
    
    await calcAndSetTasks(projectID);

  } catch (err) {
    console.log(err.message);
    res.json({
      'status': 'not ok',
      'msg': `Couldn't shift kanban item`,
      'redirectTo': null
    })
  }
}

module.exports = { createKanban, editKanban, deleteKanban, shiftKanban };

