const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");
const userExtractorAdmin = require("../middleware/userExtractorAdmin");

usersRouter.get("/", async (request, response) => {
  try {
    console.log("Entro en GET users");
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    console.log("Error GET users ", error);
    response.status(422).send(error);
  }
});

usersRouter.post("/", userExtractorAdmin, async (request, response) => {
  try {
    console.log("Entro en POST users ");
    const { username, type, name, password } = request.body;
    if (!username || !type || !name || !password) {
      return response.status(400).json({
        error: "Faltan datos necesarios para completar la solicitud.",
      });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, type, name, passwordHash });
    const storedUser = await user.save();
    response.status(201).json(storedUser);
  } catch (error) {
    console.log(error);
    response.status(422).send(error);
  }
});

usersRouter.put("/:id", userExtractorAdmin, async (request, response) => {
  try {
    console.log("Entro en PUT edit users");
    const { id } = request.params;
    const { name, type } = request.body;
    const newUser = {
      name,
      type,
    };
    const result = await User.findByIdAndUpdate(id, newUser, { new: true });
    response.json(result);
  } catch (error) {
    response.status(422).send(error);
  }
});

usersRouter.delete("/:id", userExtractorAdmin, async (request, response) => {
  try {
    console.log("Entro en DELETE users");
    const { id } = request.params;
    const result = await User.findByIdAndRemove(id);
    response.json(result);
  } catch (error) {
    response.status(422).send(error);
  }
});

module.exports = usersRouter;
