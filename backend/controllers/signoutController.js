const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const handleSignout = async (req, res) => {
  const rToken = req.cookies?.refresh_token;
  if(!rToken) {
    res.clearCookie(
      'refresh_token',
      { httpOnly: true, secure: true }
    )
    res.clearCookie(
      'access_token',
      { httpOnly: true, secure: true }
    )

    return res.redirect('/');
  }

  jwt.verify(
    rToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      try {
        if(err) {
          res.clearCookie(
            'refresh_token',
            { httpOnly: true, secure: true }
          )
          res.clearCookie(
            'access_token',
            { httpOnly: true, secure: true }
          )
      
          return res.redirect('/');
        }

        const foundUser = await Users.findOne({ uuid: decoded.uuid });
        if(!foundUser) {
          res.clearCookie(
            'refresh_token',
            { httpOnly: true, secure: true }
          )
          res.clearCookie(
            'access_token',
            { httpOnly: true, secure: true }
          )
          res.redirect('/');
        }

        foundUser.refreshToken = null;
        await foundUser.save();

        res.clearCookie(
          'refresh_token',
          { httpOnly: true, secure: true }
        )
        res.clearCookie(
          'access_token',
          { httpOnly: true, secure: true }
        )

        res.redirect('/');


      } catch (error) {
        console.log(error);
        res.redirect('/signin');
      }
    }
  )
}

module.exports = handleSignout;
