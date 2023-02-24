const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  const authorization = request.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer")) {
    return response.status(401).json({ error: "Token missing or invalid" });
  }
  const token = authorization.substring(7);

  try {
    const { id: userId } = jwt.verify(token, process.env.SECRET);
    request.userId = userId;
    next();
  } catch (error) {
    return response.status(401).json({ error: "Token missing or invalid" });
  }
};
