const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  const rToken = req.cookies?.refresh_token;
  if(!rToken) return res.redirect('/signin');
  
  const acCookie = req.cookies?.access_token;
  if(!acCookie) return res.redirect(`/refresh?pth=${req.originalUrl}`);
  const aToken = acCookie && acCookie.split(" ")[1];
  if(aToken == null) return res.redirect(`/refresh?pth=${req.originalUrl}`);

  jwt.verify(
    rToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => { if (err) return res.redirect('/signin'); }
  )

  jwt.verify(
    aToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if(err) return res.redirect('/signin');

      req.uuid = decoded.uuid;
      next();
    }
  )
}

module.exports = userAuth;
