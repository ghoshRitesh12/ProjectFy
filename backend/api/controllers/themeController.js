const Users = require('../../models/Users');

const handleThemeChange = async (req, res) => {
  try {
    const { themeChangedTo } = req.body;

    const currentUser = await Users.findOne({ uuid: req.uuid });
    currentUser.userTheme = themeChangedTo;
    await currentUser.save();

    res.sendStatus(200);

  } catch (err) {
    res.redirect('/');
  }
}

module.exports = handleThemeChange;

