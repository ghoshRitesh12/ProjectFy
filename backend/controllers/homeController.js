const notesModel = require('../models/Notes');
const usersModel = require('../models/Users');

const getHome = async (req, res) => {

  const uuid = req.uuid;
  if(uuid == null) return res.render('signin');  

  try {
    const notes = await notesModel.find({ userId: uuid });
    const user = await usersModel.findOne({ uuid: uuid });
    if(!notes) {
      console.log("XD", notes);
      return res.render('home', { error: `Wow so empty :(` });
    }

    res.render('home', { notes, user });

  } catch (err) {
    res.redirect('/');
  }
}

module.exports = { getHome }
