const genUUID = require('../config/genUUID');
const userModel = require('../models/Users');
const bcrypt = require('bcrypt');

const showSignup = async (req, res) => {
  
  res.render('signup', { name: "Toby" });
}

const handleSignup = async (req, res) => {
  const { emailId, password, confirmPassword, firstName, lastName } = req.body;
  if(!emailId || !password || !confirmPassword || !firstName)
    return res.sendStatus(400); //bad request

  try {
    const duplicateUser = await userModel.findOne({ email: emailId });
    if(duplicateUser) return res.status(409).json({ 'error' : 'User with this email already exists' });

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
    console.log(err.message); 
    res.redirect('/signup');
  }
}

module.exports = { handleSignup, showSignup }
