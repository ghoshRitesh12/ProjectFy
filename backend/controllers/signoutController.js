const userModel = require('../models/Users');

const handleSignout = async (req, res) => {
  const rjwt = req.cookies?.rjwt;
  if(!rjwt) {
    res.clearCookie(
      'rjwt',
      { httpOnly: true }
    )
    res.clearCookie(
      'ajwt',
      { httpOnly: true }
    )

    return res.redirect('/signin');
  }

  try {
    const foundUser = await userModel.findOne({ refreshToken: rjwt });
    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie(
      'rjwt',
      { httpOnly: true }
    )
    res.clearCookie(
      'ajwt',
      { httpOnly: true }
    )

    res.redirect('/signin');

  } catch (error) {
    // console.log(err.message);
    res.redirect('/singin');
  }
}

module.exports = handleSignout;
