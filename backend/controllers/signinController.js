const sendEmail = require('../config/email');
const userModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const info = {
  title: 'Sign in | ProjectFy',
  error: null,
  emailVerified: true,
  serverError: null
};

// get route
const showSignin = (req, res) => {
  res.render('signin', { info });

  info.serverError = info.error = null;
  info.emailId = info.pwd = null;
  info.emailVerified = true
  return;
}


// post route
const handleSignin = async (req, res) => {
  const { emailId, password } = req.body;
  if(!emailId || !password )
    return res.sendStatus(400); 

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
    if(!await bcrypt.compare(password, foundUser.password)) {
      info.pwd = password;
      info.emailId = emailId;
      info.error = 'In-valid credentials';

      return res.redirect('/signin');
    }
      
    if(foundUser.verified === false) {
      info.emailVerified = false;
      info.emailId = emailId; info.pwd = password;

      jwt.sign(
        { "user": foundUser._id },
        process.env.EMAIL_SECRET,
        { expiresIn: '10m' },
        async (err, newEmailToken) => {
          if(err) {
            info.serverError = 'Server error while sending confirmation email';
            return res.redirect('/signin');
          }

          const confirmUrl = `${req.protocol}://${req.get('host')}/confirmation/${newEmailToken}`;
          sendEmail({
            receiver: emailId,
            subject: 'ProjectFy Account Re-Confirmation Email',

            html: `
            <h3 style="font-family: sans-serif; background-color: #333; 
              max-width: fit-content; padding: 32px; color: #eee; border-radius: 16px;
              word-wrap: break-word; font-weight: 400;">

              <div> Hi ${emailId} </div>
              <br/>
              <div> Click on the following link to confirm your email address: </div>
              <div> Link valid upto 10 mins from arrival </div>
              <br/>
              <div> <a href="${confirmUrl}" style="color: #59caff">${confirmUrl}</a> </div>
              <br/> 
              <div> Thanks, </div>   
              <div> Team ProjectFy </div>

            </h3>
            `,
            // text: `Click this link to confirm and continue to your Account: ${confirmUrl}`,
          });

          res.redirect('/signin');
        }
      ) 
      return;
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
    
  } catch (err) {
    console.log(err.message);
    res.redirect('/signin');
  }
}

module.exports = { handleSignin, showSignin }
