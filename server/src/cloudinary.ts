const cloudinary = require('cloudinary');

cloudinary.v2.config({
	cloud_name: 'dnqlgypji',
	api_key: '498354225756571',
	api_secret: 'dxCEJghbMzdX0gtVpZUqn43eEOU',
	secure: true,
});

module.exports = cloudinary;