const userModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

const info = {
  title: 'Sign in | To-Notes_App',
  error: null,
  emailVerified: true
};

// get route
const showSignin = (req, res) => {

  res.render('signin', { info });
  info.error = null;
  info.emailId = info.pwd = null;
  info.emailVerified = true
  return;
}


// post route
const handleSignin = async (req, res) => {
  const { emailId, password } = req.body;
  if(!emailId || !password )
    return res.sendStatus(400); //bad request

  // validation errors
  const validationError = validationResult(req);
  if(!validationError.isEmpty()) {
    info.emailId = emailId;
    info.pwd = password;

    info.error = validationError.errors[0].msg;
    return res.redirect('/signin');
  }

  try {
    const foundUser = await userModel.findOne({ email: emailId });
    if(!foundUser) {
      info.emailId = emailId;
      info.pwd = password;
      info.error = 'In-valid credentials' ;
      return res.redirect('/signin');
    }

    // checking for correct password
    if(await bcrypt.compare(password, foundUser.password)) {
      
      if(foundUser.verified !== true) {
        info.emailVerified = false;
        info.emailId = emailId; info.pwd = password;
        return res.redirect('/signin');
      }

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
