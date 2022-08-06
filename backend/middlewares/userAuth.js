const jwt = require('jsonwebtoken');

const userLogout = (req, res, next) => {
  const rjwt = req.cookies?.rjwt;
  if(!rjwt) return res.redirect('/signin');

  next();
}

// user Auth for rendering index.ejs and signin.ejs according to auth condition
const userAuth = (req, res, next) => {
  const rjwt = req.cookies?.rjwt;
  if(!rjwt) return res.render('signin');

  const aToken = req.cookies?.ajwt;
  if(!aToken) return res.redirect('/refresh');

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

module.exports = { userAuth, userLogout }
