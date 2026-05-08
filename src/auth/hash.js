const bcrypt = require("bcrypt");

/**
 * Hashes a password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10; // Livello di complessità (10 è lo standard bilanciato)
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Verifies if a provided password matches the stored hash
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The stored hash to compare against
 * @returns {Promise<boolean>} - True if they match, false otherwise
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };
