const userModel = require('../../models/Users');

const handleThemeChange = async (req, res) => {
  try {
    const { themeChangedTo } = req.body;

    const currentUser = await userModel.findOne({ uuid: req.uuid });
    currentUser.userTheme = themeChangedTo;
    await currentUser.save();

    res.sendStatus(200);

  } catch (err) {
    res.redirect('/');
  }
}

module.exports = handleThemeChange;

