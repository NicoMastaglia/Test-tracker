const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Benvenuto!");
});

router.get("*", (req, res) => {
  res.status(404).json({ error: "Endpoint non trovato" });
});

module.exports = router;
