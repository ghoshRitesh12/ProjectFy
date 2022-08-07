const signedIn = (req, res, next) => {

  const rToken = req.cookies?.refresh_token;
  if(!rToken) return next();

  const acCookie = req.cookies?.access_token;
  if(acCookie) return res.redirect('back');

  // const aToken = acCookie && acCookie.split(" ")[1];
  // if(aToken == null) return res.redirect('/');
}

module.exports = signedIn;
