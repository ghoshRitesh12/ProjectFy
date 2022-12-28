// already signed in middleware check

const signedIn = (req, res, next) => {

  const rToken = req.cookies?.refresh_token;
  if(!rToken) { next(); return; }

  const acCookie = req.cookies?.access_token;
  if(!acCookie) return res.redirect('/refresh');
  return res.redirect('/');
}

module.exports = signedIn;
