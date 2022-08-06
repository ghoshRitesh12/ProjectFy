const signedIn = (req, res, next) => {

  const rToken = req.cookies?.rjwt;
  if(!rToken) return next();

  const aToken = req.cookies?.ajwt;
  if(aToken) return res.redirect('/');
}

module.exports = signedIn;
