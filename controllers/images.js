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
      const { file, body } = request;
      const { fileName } = body;
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

      const storedImage = await s3.upload(uploadParams).promise();
      await unlinkFile(file.path);
      return response.json({ imagePath: storedImage.Location });
    } catch (error) {
      console.log("error uploading image ", error);
      return response.status(500).send({ error: "Error uploading image" });
    }
  }
);

imagesRouter.delete("/:id", userExtractor, async (request, response) => {
  try {
    const { id } = request.params;
    const params = { Bucket: "alchimia", Key: id };

    await s3.headObject(params).promise();
    await s3.deleteObject(params).promise();

    return response.status(200).send(true);
  } catch (error) {
    console.log("error deleting image ", error);
    return response.status(500).send({ error: "Error deleting image" });
  }
});

module.exports = imagesRouter;
