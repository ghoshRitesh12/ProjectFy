const Users = require('../../models/Users');

const query = { src: [] };

const readyResults = (projects) => {
  return new Promise((resolve, reject) => {
    const mappedSource = [...projects].map(i => {
      const name = [...`${i.projectOverview.name}`.toLowerCase().split(" ")];
      const goals = [...`${i.projectOverview.goals}`.toLowerCase().split(" ")];

      const ideas = [...i.projectIdeas].map(j => `${j.description}`.toLowerCase().split(" "));

      const kanbans = [...i.projectKanban].map(j => {
        const title = `${j.title}`.toLowerCase().split(" ");
        const description = `${j.description}`.toLowerCase().split(" ");
        return [title, description]
      });

      const spreadIdeas = ideas.flat();
      const spreadKanbans = kanbans.flat(2);
      
      return {
        id: `${i._id}`, 
        name: `${i.projectOverview.name}`,
        src: [...name, ...goals, ...spreadIdeas, ...spreadKanbans].join(" ")
      }
    });

    if(mappedSource.length<=0) {
      reject('No mapped source');
      return;
    }
    resolve(mappedSource);
  })
}

const getQueryResults = (searchQuery) => {
  return new Promise(async (resolve, reject) => {
    searchQuery = searchQuery.toLowerCase();
    
    const results = [...query.src].map(item => {
      if(item.src.includes(searchQuery)) {
        return { id: item.id, name: item.name }
      }

    }).filter(i => i != null);

    if(results.length<=0) {
      reject('No results found');
      return;
    }
    resolve(results);
  })
}


const readyQueryResults = async (req, res) => {
  const userId = req.uuid;
  const queryFields = ['projectOverview', 'projectIdeas', 'projectKanban'];
  try {
    const foundUser = await Users.findOne({ uuid: userId }, 'projects');
    const allProjects = (await foundUser.populate('projects', queryFields)).projects;

    query.src = await readyResults(allProjects);
    res.sendStatus(200);
    
  } catch (error) {
    res.sendStatus(400);
  }
}

const handleQuery = async (req, res) => {
  const userId = req.uuid;
  const { query } = req.params;

  try {
    const foundUser = await Users.findOne({ uuid: userId }, 'projects');
    if(!foundUser) {
      res.json({
        'status': 'not ok',
        'msg': 'Search unsuccessful',
        'results': null,
        'searchedQuery': query
      })
      return;
    }

    const queryResults = await getQueryResults(query);

    res.json({
      'status': 'ok',
      'msg': 'Search successful',
      'results': queryResults,
      'searchedQuery': query
    })

  } catch (error) {
    res.json({
      'status': 'not ok',
      'msg': 'Search unsuccessful',
      'results': null,
      'searchedQuery': query
    })
  }
}

module.exports = { handleQuery, readyQueryResults };
