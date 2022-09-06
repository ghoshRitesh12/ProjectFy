const jwt = require('jsonwebtoken');
const userModel = require('../models/Users');

const confirmEmailHandler = async(req, res) => {
  const { token } = req.params;

  jwt.verify(
    token,
    process.env.EMAIL_SECRET,
    async (err, {user}) => {
      if(err) return res.send('Confirmation Failed');

      const confirmedUser = await userModel.findById(user);
      confirmedUser.verified = true;
      await confirmedUser.save();

      return res.redirect('/signin');
    }
  )
}

module.exports = confirmEmailHandler;
