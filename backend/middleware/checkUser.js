const jwt = require("jsonwebtoken");
const { isTokenDenied } = require("../auth/tokenDenylist");
require("dotenv").config();

const checkUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token mancante o formato non valido" });
  }

  const token = authHeader.split(" ")[1];

  if (isTokenDenied(token)) {
    return res.status(401).json({ message: "Token non valido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (
      decoded.role === "user" ||
      decoded.role === "admin" ||
      decoded.role === "superadmin"
    ) {
      req.user = { ...decoded, id: decoded.id, role: decoded.role };
      req.token = token;
      next();
    } else {
      return res.status(403).json({ message: "Accesso negato" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Token non valido" });
  }
};

module.exports = checkUser;
