'use strict'

const mime = require('mime')
const AWS = require('aws-sdk')

const s3 = new AWS.S3()
const S3_REGION = process.env.S3_REGION
const S3_BUCKET = process.env.S3_BUCKET
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

AWS.config.update({
  region: S3_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

const filename = 'file.txt'
const filetype = mime.lookup(filename)

function getSignedUrl(filename, filetype) {

  const params = {
    Bucket: S3_BUCKET,
    Key: filename,
    ContentType: filetype,
    ACL: 'public-read'
  }

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, data) => {
      if (err) reject(err)
      resolve({
        signed_request: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${filename}`
      })
    })
  })

}

getSignedUrl(filename, filetype)
.then(response => {
  console.log(response)
})
.catch(error => {
  console.log(error)
})


