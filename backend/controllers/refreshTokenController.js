const jwt = require('jsonwebtoken');
const userModel = require('../models/Users');

const handleRefreshToken = async (req, res) => {
  const { pth } = req.query;

  const aToken = req.cookies?.access_token;
  if(aToken) return res.redirect('/');

  const rToken = req.cookies?.refresh_token;
  if(!rToken) return res.redirect('/signin'); 
    
  jwt.verify(
    rToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if(err) return res.redirect('/signin');
      
      try {
        const foundUser = await userModel.findOne({ uuid: decoded.uuid })
        if(!foundUser) return res.redirect('/signin');

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
  
        if(!pth) return res.redirect('back');
        return res.redirect(pth);

      } catch (err) {
        res.redirect('/signin');
      }
    }
  )
}

module.exports = handleRefreshToken;
