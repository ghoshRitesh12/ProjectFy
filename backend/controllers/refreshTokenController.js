const jwt = require('jsonwebtoken');
const userModel = require('../models/Users');

const handleRefreshToken = async (req, res) => {
  const rToken = req.cookies?.refresh_token;
  if(!rToken) { 
    console.log('refresh Token not present');
    return res.redirect('/signin');
  }

  try {
    const foundUser = await userModel.findOne({ refreshToken: rToken });
    if(!foundUser) return res.redirect('/signin');

    jwt.verify(
      rToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if(err || decoded.uuid !== foundUser.uuid) 
          return res.redirect('/signin');

        const newAccessToken = jwt.sign(
          { "uuid": decoded.uuid },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        )

        res.cookie(
          'access_token',
          `Bearer ${newAccessToken}`,
          { httpOnly: true, maxAge: 15 * 60 * 1000 }
        )

        // res.redirect('.');
        res.redirect('back');

      }
    )
  } catch (err) {
    res.redirect('/signin');
  }
}

module.exports = handleRefreshToken;
