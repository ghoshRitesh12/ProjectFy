const genUUID = require('../config/genUUID');
const userModel = require('../models/Users');
const bcrypt = require('bcrypt');

const info = {
  title: 'Sign up | To-Notes_App',
  error: null
};

const showSignup = (req, res) =>  {
  res.render('signup', { info });
  info.error = null;
  return;
}

const handleSignup = async (req, res) => {
  const { 
    emailId, password, confirmPassword,
    firstName, lastName 
  } = req.body;

  if(!emailId || !password || !confirmPassword || !firstName)
    return res.sendStatus(400); //bad request

  try {
    const duplicateUser = await userModel.findOne({ email: emailId });
    if(duplicateUser) 
      return res.render('signup', { error_user: 'User with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      uuid: genUUID().toString(),
      name: `${firstName.trim()} ${lastName}`,
      email: emailId,
      password: hashedPassword
    };

    await userModel.create(newUser);

    res.redirect('/signin');

  } catch (err) {
    res.redirect('/signup');
  }
}

module.exports = { handleSignup, showSignup }
