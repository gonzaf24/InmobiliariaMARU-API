const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

loginRouter.post("/", async (request, response) => {
  console.log(" Entro en POST login");
  const { body } = request;
  const { username, password } = body;
  const user = await User.findOne({ username });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: "invalid user or password" });
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  });

  const userOut = {
    id: user._id,
    username: user.username,
    name: user.name,
    type: user.type,
    token,
  };

  response.status(201).json(userOut);
});

module.exports = loginRouter;
