const notesModel = require('../models/Notes');

const getNote = async (req, res) => {
  const { id: noteId } = req.query;
  const uuid = req.uuid;

  try {
    // const foundNote = await notesModel.findOne({ _id: noteId });
    const foundNote = await notesModel.findOne({ userId: uuid }).where('_id').equals(noteId);
    if(!foundNote) return res.render('404');

    res.render('edit', { data: foundNote });

  } catch (err) {
    res.redirect('back');
  }
}

module.exports = { getNote }
