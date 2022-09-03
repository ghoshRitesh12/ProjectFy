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
  info.firstName = info.lastName = info.emailId = null;
  info.pwd = info.confirmPwd = null;
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
    const duplicateUser = await userModel.findOne({ email: emailId.trim() });
    if(duplicateUser)  {
      info.firstName = firstName; info.lastName = lastName;
      info.emailId = emailId;
      info.pwd = password; info.confirmPwd = confirmPassword;
      info.error = 'User with this email already exists';
      return res.redirect('/signup');
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = {
      uuid: genUUID().toString(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: emailId.trim(),
      password: hashedPassword
    };

    await userModel.create(newUser);

    res.redirect('/signin');

  } catch (err) {
    res.redirect('/signup');
  }
}

module.exports = { handleSignup, showSignup }
