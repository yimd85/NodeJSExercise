const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    // endpoint: 's3.us-east-1.amazonaws.com',
    // region: 'us-east-1',
    // signatureVersion: 'v4'
});

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`;

        s3.getSignedUrl('putObject', {
            Bucket: 'david-blog-bucket-123',
            ContentType: 'image/jpeg',
            Key: key
      }, (err, url) => res.send({ key, url }));
    });
};
