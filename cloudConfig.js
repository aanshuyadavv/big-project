//before uploading the files to third party app it is important to access the app and for that
// 'cloudConfig.js' has been created

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({   //  to connect it with the app
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//config means jodna


const storage = new CloudinaryStorage({    // to provide where the files will be saved
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ['png', 'jpg', 'jpeg'],
    },
  });
   

  module.exports = {
    cloudinary,
    storage
  }