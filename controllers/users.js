const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");
const userExtractorAdmin = require("../middleware/userExtractorAdmin");

usersRouter.get("/", async (request, response) => {
  try {
    console.log(" Entro en GET users");
    const users = await User.find({});
    return response.status(201).json(users);
  } catch (error) {
    console.log("Error GET users ", error);
    return response.status(422).send(error);
  }
});

usersRouter.post("/", userExtractorAdmin, async (request, response) => {
  try {
    console.log("Entro en POST users ");
    const { body } = request;
    const { username, type, name, password } = body;
    if (!username || !type || !name || !password) {
      return response.status(400).json({
        error: "Faltan datos necesarios para completar la solicitud.",
      });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, type, name, passwordHash });
    const storedUser = await user.save();
    return response.status(201).json(storedUser);
  } catch (error) {
    console.log(error);
    console.log("Error POST users ", error);
    return response.status(422).send;
  }
});

usersRouter.put("/:id", userExtractorAdmin, (request, response, next) => {
  try {
    console.log(" Entro en PUT edit users");
    const { id } = request.params;
    console.log(" id user ", id);
    const { name, type } = request.body;
    console.log(" name and type ", name, type);
    const newUser = {
      name,
      type,
    };
    console.log(" newUser to edit ", newUser);
    return User.findByIdAndUpdate(id, newUser, { new: true })
      .then((result) => {
        console.log("result User.findByIdAndUpdate", result);
        return response.json(result);
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

usersRouter.delete("/:id", userExtractorAdmin, (request, response, next) => {
  try {
    console.log(" Entro en DELETE users");
    const { id } = request.params;
    console.log(" id user ", id);
    return User.findByIdAndRemove(id)
      .then((result) => {
        console.log("result User.findByIdAndRemove", result);
        return response.json(result);
      })
      .catch((error) => {
        console.log("error User.findByIdAndRemove", error);
        return response.status(422).send(error);
      });
  } catch (error) {
    console.log("error al delete user ", error);
    return response.status(422).send;
  }
});

module.exports = usersRouter;
