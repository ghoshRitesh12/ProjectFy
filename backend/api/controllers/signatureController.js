const cloudinary = require('cloudinary').v2;

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.IMG_CLOUD_NAME,
  api_key: process.env.IMG_CLOUD_API_KEY,
  api_secret: process.env.IMG_CLOUDINARY_SECRET,
  secure: true
})

const getSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp: timestamp },
      cloudinaryConfig.api_secret
    )

    res.json({
      timestamp, signature
    })

  } catch (err) {
    console.log(err);
  }

}

module.exports = getSignature;

