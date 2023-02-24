const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (request, response, next) => {
  const authorization = request.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer")) {
    return response.status(401).json({ error: "Token missing or invalid" });
  }

  const token = authorization.substring(7);

  try {
    const { id: userId } = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(userId);

    if (!user || user.type !== "admin") {
      return response
        .status(406)
        .json({ error: "User doesn't have Admin permission" });
    }

    request.userId = userId;
    next();
  } catch (error) {
    return response.status(401).json({ error: "Token missing or invalid" });
  }
};
