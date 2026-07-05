const express = require("express");
const router = express.Router();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

router.get("/", (req, res) => {
  res.status(302).redirect(`${frontendUrl}/login`);
});

router.get("/login", (req, res) => {
  res.status(302).redirect(`${frontendUrl}/login`);
});

router.get("/dashboard", (req, res) => {
  res.status(302).redirect(`${frontendUrl}/dashboard`);
});

router.get("/user/projects", (req, res) => {
  res.status(302).redirect(`${frontendUrl}/user/projects`);
});

router.get("/user/checklists", (req, res) => {
  res.status(302).redirect(`${frontendUrl}/user/checklists`);
});

router.get("/admin/projects", (req, res) => {
  res.status(302).redirect(`${frontendUrl}/admin/projects`);
});

router.get("/admin/projects/:id", (req, res) => {
  res.status(302).redirect(`${frontendUrl}/admin/projects/${req.params.id}`);
});

router.get("/admin/projects/:id/checklist", (req, res) => {
  res.status(302).redirect(`${frontendUrl}/admin/projects/${req.params.id}/checklist`);
});

router.get("/admin/users", (req, res) => {
  res.status(302).redirect(`${frontendUrl}/admin/users`);
});

router.get("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

module.exports = router;
