const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

loginRouter.post("/", async (request, response) => {
  try {
    const { body } = request;
    const { username, password } = body;
    const user = await User.findOne({ username });

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    console.log("passwordCorrect isss  : ", passwordCorrect);

    if (!(user && passwordCorrect)) {
      response.status(401).json({
        error: "invalid user or password",
      });
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
  } catch (e) {
    console.log("error en login es : ", e);
  }
});

module.exports = loginRouter;
