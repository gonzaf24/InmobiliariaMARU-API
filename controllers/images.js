const bcrypt = require("bcrypt");
const imagesRouter = require("express").Router();
const userExtractor = require("../middleware/userExtractor");
const S3 = require("aws-sdk/clients/s3");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const s3 = new S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESSS_KEY,
});

imagesRouter.post(
  "/",
  upload.single("image"),
  userExtractor,
  async (request, response) => {
    try {
      console.log(" Entro en POST images ");
      let file = request.file;
      const fileName = request.body.fileName;
      const fileStream = fs.createReadStream(file.path);
      const lastDot = fileName.lastIndexOf(".");
      const ext = fileName.substring(lastDot + 1);

      const uploadParams = {
        Bucket: "alchimia",
        Body: fileStream,
        Key: fileName,
        ContentType: `image/${ext}`,
        ACL: "public-read",
      };
      const storedImage = await s3
        .upload(uploadParams)
        .promise()
        .then((response) => response.Location)
        .catch((e) => console.log("s3 error , ", e));

      await unlinkFile(file.path);
      response.send({ imagePath: storedImage });
    } catch (error) {
      console.log("error uploading image ", error);
      console.log("fileName  ", fileName);
      return response.status(404).send(error);
    }
  }
);

imagesRouter.delete("/:id", userExtractor, async (request, response, next) => {
  try {
    console.log(" Entro en DELETE images ");
    const { id } = request.params;
    var params = { Bucket: "alchimia", Key: id };
    try {
      await s3.headObject(params).promise();
      // console.log("File Found in S3");
      try {
        await s3.deleteObject(params).promise();
        return response.status(200).send(true);
      } catch (error) {
        // console.log("ERROR in file Deleting : " + JSON.stringify(error));
        return response.status(404).send(error);
      }
    } catch (error) {
      // console.log("File not Found ERROR : " + error);
      return response.status(404).send(error);
    }
  } catch (error) {
    console.log("error delete ", error);
    return response.status(404).send(error);
  }
});

module.exports = imagesRouter;
