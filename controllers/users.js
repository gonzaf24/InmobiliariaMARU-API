const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");
const userExtractor = require("../middleware/userExtractor");

usersRouter.get("/", async (request, response) => {
  try {
    console.log(" Entro en GET users");
    const users = await User.find({});
    console.log(" users --- > ", users);
    response.status(201).json(users);
  } catch (error) {
    console.log("  Entro ERRRORRRRR GET users ", error);
    return response.status(422).send(error);
  }
});

usersRouter.post("/", async (request, response) => {
  const { body } = request;
  const { username, type, name, password } = body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    type,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.put("/:id", userExtractor, (request, response, next) => {
  try {
    console.log(" Entro en PUT edit users");
    const { id } = request.params;
    const { username, name, type } = request.body;
    const newUser = {
      username,
      name,
      type,
    };
    User.findByIdAndUpdate(id, newUser, { new: true })
      .then((result) => {
        response.json(result);
      })
      .catch((error) => {
        console.log("error User.findByIdAndUpdate", error);
        return response.status(422).send(error);
      });
  } catch (error) {
    console.log("error al update user ", error);
    return response.status(422).send(error);
  }
});

module.exports = usersRouter;
