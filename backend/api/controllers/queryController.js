const Users = require('../../models/Users');

const getQueryResults = (projects, searchQuery) => {
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
        src: [...name, ...goals, ...spreadIdeas, ...spreadKanbans]
      }
    });
    

    const results = mappedSource.map(item => {
      if(item.src.includes(searchQuery.toLowerCase())) {
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


const handleQuery = async (req, res) => {
  const userId = req.uuid;
  const { query } = req.params;

  const queryFields = ['projectOverview', 'projectIdeas', 'projectKanban'];

  try {
    const foundUser = await Users.findOne({ uuid: userId }, 'projects');
    const allProjects = (await foundUser.populate('projects', queryFields)).projects;

    const queryResults = await getQueryResults(allProjects, query);
    

    res.json({
      'status': 'ok',
      'msg': 'Search successful',
      'results': queryResults,
      'searchedQuery': query
    })

  } catch (error) {
    console.log(error);
    res.json({
      'status': 'not ok',
      'msg': 'Search unsuccessful',
      'results': null,
      'searchedQuery': query
    })
  }
}

module.exports = handleQuery;
