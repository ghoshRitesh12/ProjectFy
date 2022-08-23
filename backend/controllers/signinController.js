const userModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const info = {
  title: 'Sign in | To-Notes_App',
  error: null
};

const showSignin = (req, res) => {

  res.render('signin', { info });
  // info.err.emailId = info.err.password = null;
  info.error = null;
  info.emailId = info.pwd = null;
  return;
}

const handleSignin = async (req, res) => {
  const { emailId, password } = req.body;
  if(!emailId || !password )
    return res.sendStatus(400); //bad request

  try {
    const foundUser = await userModel.findOne({ email: emailId });
    if(!foundUser) {
      info.emailId = emailId;
      info.pwd = password;
      info.error = 'In-correct email id' ;
      return res.redirect('/signin');
    }

    // checking for correct password
    if(await bcrypt.compare(password, foundUser.password)) {
      const accessToken = jwt.sign(
        { "uuid": foundUser.uuid },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { "uuid": foundUser.uuid },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      res.cookie(
        'access_token',
        `Bearer ${accessToken}`,
        { httpOnly: true, maxAge: 15 * 60 * 1000 }
      )
      res.cookie(
        'refresh_token',
        refreshToken,
        { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
      )

      return res.redirect('/');
    } else {
      info.pwd = password;
      info.emailId = emailId;
      info.error = 'Invalid Password';
      return res.redirect('/signin');
    }

  } catch (err) {
    res.redirect('/signin');
  }
}

module.exports = { handleSignin, showSignin }
