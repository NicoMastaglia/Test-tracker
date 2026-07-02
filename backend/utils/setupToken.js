const crypto = require("crypto")


function generateSetupToken() {
    const token = crypto.randomBytes(32).toString("hex"); // va nell'email
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex"); // va nel db
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 ore
    return { token, tokenHash, expiresAt };
}

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

module.exports = { generateSetupToken, hashToken };