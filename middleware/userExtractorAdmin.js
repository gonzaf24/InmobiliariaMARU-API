const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (request, response, next) => {
  const authorization = request.get("authorization");
  let token = "";

  if (authorization === undefined || authorization === null) {
    console.log(" token extractor admin [[ " + authorization + " ]]");
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    console.log("token missing or invalid");
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const { id: userId } = decodedToken;

  const user = await User.findById(userId);
  if (user.type !== "admin") {
    return response
      .status(406)
      .json({ error: "user doesn't have Admin permission." });
  }
  request.userId = userId;
  next();
};
