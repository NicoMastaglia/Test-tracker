const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token mancante o formato non valido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "admin" || decoded.role === "superadmin") {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: "Accesso negato" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Token non valido" });
  }
};

module.exports = checkAdmin;
