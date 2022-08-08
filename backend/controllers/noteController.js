const notesModel = require('../models/Notes');

const getNote = async (req, res) => {
  const { id: noteId } = req.query;
  if(!noteId) return res.render('404');

  const uuid = req.uuid;
  if(uuid == null) return res.redirect('/signin'); 

  try {
    const foundNote = await notesModel.findOne({ userId: uuid }).where('_id').equals(noteId);
    if(!foundNote) return res.render('404');

    res.render('edit', { data: foundNote });

  } catch (err) {
    res.redirect('back');
  }
}

module.exports = { getNote }
