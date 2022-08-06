const jwt = require('jsonwebtoken');

function verifyJwt(req, res, next) {
  const rjwt = req.cookies?.rjwt;
  if(!rjwt) return res.redirect('/signin');

  const aToken = req.cookies?.ajwt;
  if(!aToken) return res.redirect('/refresh');

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

module.exports = verifyJwt;
