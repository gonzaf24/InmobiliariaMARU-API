
const bcrypt = require('bcrypt')
const imagesRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')
const S3 = require('aws-sdk/clients/s3')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)


const s3 = new S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESSS_KEY
})

imagesRouter.post('/', upload.single('image'), userExtractor, async (req, res) => {
  console.log("ENTRO A AGREGAR IMAGEN ");
  try {
    let file = req.file
    const fileName = req.body.fileName
    const fileStream = fs.createReadStream(file.path)
    const lastDot = fileName.lastIndexOf(".");
    const ext = fileName.substring(lastDot + 1);
    const uploadParams = {
      Bucket: 'alchimia',
      Body: fileStream,
      Key: fileName,
      ContentType: `image/${ext}`,
      ACL: 'public-read'
    }
    const response = await s3.upload(uploadParams).promise().then((res) => res.Location).catch((e) => console.log("s3 error , ", e))
    await unlinkFile(file.path)
    res.send({ imagePath: response })
  } catch (error) {
    console.log("error edesl ", error)
  }
})

imagesRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const { id } = request.params
    console.log("aqui el delete de imagen id: ", id)
    var params = { Bucket: 'alchimia', Key: id }
    try {
      await s3.headObject(params).promise()
      console.log("File Found in S3")
      try {
        await s3.deleteObject(params).promise()
        console.log("file deleted Successfully")
        return response.status(204).end()
      }
      catch (err) {
        console.log("ERROR in file Deleting : " + JSON.stringify(err))
        return response.sendStatus(404)
      }
    } catch (err) {
      console.log("File not Found ERROR : " + err.code)
      return response.sendStatus(404)
    }

  } catch (error) {
    console.log("error delete ", error)
    return response.sendStatus(404)
  }
})

module.exports = imagesRouter