const userModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const showSignin = async (req, res) => res.render('signin');

const handleSignin = async (req, res) => {
  const { emailId, password } = req.body;
  if(!emailId || !password )
    return res.sendStatus(400); //bad request

  try {
    const foundUser = await userModel.findOne({ email: emailId });
    if(!foundUser) 
      return res.render('signin', { error_emailId: 'In-correct email id' });

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
    } 
    return res.render('signin', { error_password: 'Invalid Password' });

  } catch (err) {
    res.redirect('/signin');
  }
}

module.exports = { handleSignin, showSignin }
