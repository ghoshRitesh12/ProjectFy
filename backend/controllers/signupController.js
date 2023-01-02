const genUUID = require('../config/genUUID');
const sendEmail = require('../config/email');
const userModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const info = {
  title: 'Create ProjectFy Account',
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

        const confirmUrl = `${req.protocol}://${req.get('host')}/confirmation/${emailToken}`

        // await makes it slow
        sendEmail({
          receiver: emailId,
          subject: 'ProjectFy Account Confirmation Email',
          html: `
          <h3 style="font-family: sans-serif; background-color: #333; 
            max-width: fit-content; padding: 32px; color: #eee; border-radius: 16px;
            word-wrap: break-word; font-weight: 400;">

            <div> Hi ${emailId} </div>
            <br/>
            <div> Thank you for registering with ProjectFy </div>
            <br/>
            <div> Click on the following link to confirm your email address: </div>
            <div> Link valid upto 10 mins from arrival </div>
            <br/>
            <div> <a href="${confirmUrl}" style="color: #59caff">${confirmUrl}</a> </div>
            <br/> 
            <div> Thanks, </div>   
            <div> Team ProjectFy </div>

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
