// Domini ammessi: solo gmail.com e example.com (o example senza TLD) per questo contesto
// Deve restare allineato con frontend/src/utils/helpers/validators.js

const ALLOWED_DOMAINS = ["gmail.com", "example.com", "example"];

const isEmailValid = (email) => {
  const match = email.match(/^[a-zA-Z0-9._%+-]+@(.+)$/);
  if (!match) return false;
  return ALLOWED_DOMAINS.includes(match[1].toLowerCase());
};

module.exports = { isEmailValid };
