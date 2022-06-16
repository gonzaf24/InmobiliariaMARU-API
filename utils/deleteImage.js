const S3 = require('aws-sdk/clients/s3')

const s3 = new S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESSS_KEY
})

const deleteImage = async (imgSrc) => {
  console.log("Src deleted : ", imgSrc)
  try {
    var params = { Bucket: 'alchimia', Key: imgSrc }
    try {
      await s3.headObject(params).promise()
      console.log("File Found in S3")
      try {
        await s3.deleteObject(params).promise()
        console.log("file deleted Successfully")
        //return response.status(204).end()
      }
      catch (err) {
        console.log("ERROR in file Deleting : " + JSON.stringify(err))
        //return response.sendStatus(404)
      }
    } catch (err) {
      console.log("File not Found ERROR : " + err.code)
      //return response.sendStatus(404)
    }

  } catch (error) {
    console.log("error delete ", error)
    //return response.sendStatus(404)
  }

}

module.exports = {
  deleteImage
}
