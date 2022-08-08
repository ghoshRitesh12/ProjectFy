const userModel = require('../models/Users');

const handleSignout = async (req, res) => {
  const rToken = req.cookies?.refresh_token;
  if(!rToken) {
    res.clearCookie(
      'refresh_token',
      { httpOnly: true }
    )
    res.clearCookie(
      'access_token',
      { httpOnly: true }
    )

    return res.redirect('/');
  }

  try {
    const foundUser = await userModel.findOne({ refreshToken: rToken });
    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie(
      'refresh_token',
      { httpOnly: true }
    )
    res.clearCookie(
      'access_token',
      { httpOnly: true }
    )

    res.redirect('/');

  } catch (error) {
    res.redirect('/');
  }
}

module.exports = handleSignout;
