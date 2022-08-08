const jwt = require('jsonwebtoken');

// user Auth for rendering index.ejs and signin.ejs according to auth condition
const userAuth = (req, res, next) => {
  const rToken = req.cookies?.refresh_token;
  if(!rToken) return res.render('signin');

  const acCookie = req.cookies?.access_token;
  if(!acCookie) {
    console.log('redirected to refresh');
    return res.redirect('/refresh'); 
  }
  const aToken = acCookie && acCookie.split(" ")[1];
  if(aToken == null) return res.redirect('/refresh');

  jwt.verify(
    rToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => { if (err) return res.redirect('/signin'); }
  )
  
  jwt.verify(
    aToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if(err) return res.render('signin');

      req.uuid = decoded.uuid;
      next();
    }
  )
}

module.exports = { userAuth }
