const notesModel = require('../models/Notes');

const getHome = async (req, res) => {
  const uuid = req.uuid;
  if(uuid == null) return res.render('signin');

  try {
    const notes = await notesModel.find({ userId: uuid });
    if(!notes) return res.render('index', { error: `Wow so empty :(` });

    res.render('index', { notes });

  } catch (err) {
    res.redirect('/');
  }
}

module.exports = { getHome }
