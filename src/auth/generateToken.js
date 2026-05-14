const jwt = require("jsonwebtoken");
require("dotenv").config();

// Chiave segrete per la firma dei token
const JWT_SECRET = process.env.JWT_SECRET;

function generateAccessToken(user) {
  // 1. Dati che il token trasporterà
  const payload = {
    username: user.username,
    role: user.role,
    id: user.id,
  };

  // 2. Opzioni del token
  const options = {
    expiresIn: "6h",
  };

  // 3. Firma del token
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = {
  generateAccessToken,
};
