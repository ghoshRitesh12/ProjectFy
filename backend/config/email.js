const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.SENDER_EMAIL_ID,
    pass: process.env.SENDER_EMAIL_PWD
  }
});

const sendEmail = async (mail) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL_ID,
      to:  mail.receiver,
      subject: mail.subject,
      text: mail.text
    }
  
    await transporter.sendMail(mailOptions);
    console.log("mail sent to", mail.receiver);

  } catch (err) {
    return err.message;
  }  
}

module.exports = sendEmail;
