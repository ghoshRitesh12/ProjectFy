const jwt = require('jsonwebtoken');
const userModel = require('../models/Users');

const confirmEmailHandler = async(req, res) => {
  const { token } = req.params;

  jwt.verify(
    token,
    process.env.EMAIL_SECRET,
    async (err, decoded) => {
      if(err) return res.render('404', { confirmationError: 'Link validity expired, try again' });

      const confirmedUser = await userModel.findById(decoded.user);

      if(confirmedUser.verified === true) return res.redirect('/signin');

      confirmedUser.verified = true;
      await confirmedUser.save();

      return res.redirect('/signin');
    }
  )
}

module.exports = confirmEmailHandler;
