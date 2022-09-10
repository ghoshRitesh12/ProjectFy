const genUUID = require('../config/genUUID');
const sendEmail = require('../config/email');
const userModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const info = {
  title: 'Sign up | To-Notes_App',
  error: null,
  serverError: null,
  emailSent: null
};

// get route
const showSignup = (req, res) =>  {
  res.render('signup', { info });
  info.error = null;
  info.firstName = info.lastName = info.emailId = null;
  info.pwd = info.confirmPwd = null;
  info.serverError = null;
  info.emailSent = null;
  return;
}


// post route
const handleSignup = async (req, res) => {
  const { 
    emailId, password, confirmPassword,
    firstName, lastName 
  } = req.body;

  if(!emailId || !password || !confirmPassword || !firstName)
    return res.sendStatus(400); //bad request

  // validation errors
  const validationError = validationResult(req);
  if(!validationError.isEmpty()) {
    info.firstName = firstName; info.lastName = lastName;
    info.emailId = emailId;
    info.pwd = password; info.confirmPwd = confirmPassword;

    info.error = validationError.errors[0].msg;
    return res.redirect('/signup');
  }

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
    const currentUser = await userModel.create(newUser);
    
    jwt.sign(
      { 'user': currentUser._id },
      process.env.EMAIL_SECRET,
      { expiresIn: '10m' },
      async (err, emailToken) => {
        if(err) {
          info.serverError = 'Server error while sending confirmation email';
          return res.redirect('/signup');
        } 

        const confirmUrl = `http://localhost:4000/confirmation/${emailToken}`

        // await makes it slow
        sendEmail({
          receiver: emailId,
          subject: 'Confirmation Email',
          html: `
          <h3 style="font-family: sans-serif; color: #333">
            Please click this link to confirm your account: 
            <br/> <a href="${confirmUrl}">${confirmUrl}</a>
            <br/> Link valid upto 10 mins from arrival
          </h3>
          `
        });

        info.emailSent = emailId;
        return res.redirect('/signup');
        
      }      
    );
  } catch (err) {
    res.redirect('/signup');
  }
}

module.exports = { handleSignup, showSignup }
