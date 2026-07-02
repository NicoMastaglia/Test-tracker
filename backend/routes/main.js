const express = require("express");
const checkUser = require("../middleware/checkUser");
const checkAdmin = require("../middleware/checkAdmin");
const checkSuperadmin = require("../middleware/checkSuperadmin");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(302).redirect("/login");
});

router.get("/login", (req, res) => {
  res.status(302).redirect("/login");
});

router.get("/dashboard", checkUser, (req, res) => {
  res.status(302).redirect("/dashboard");
});

router.get("/user/projects", checkUser, (req, res) => {
  res.status(302).redirect("/user/projects");
});

router.get("/user/checklists", checkUser, (req, res) => {
  res.status(302).redirect("/user/checklists");
});

router.get("/admin/projects ", checkAdmin, (req, res) => {
  res.status(302).redirect("/admin/projects");
});

router.get("/admin/projects/:id ", checkAdmin, (req, res) => {
  res.status(302).redirect(`/admin/projects/${req.params.id}`);
});

router.get("/admin/projects/:id/checklist ", checkAdmin, (req, res) => {
  res.status(302).redirect(`/admin/projects/${req.params.id}/checklist`);
});

router.get("/admin/users ", checkSuperadmin, (req, res) => {
  res.status(302).redirect("/admin/users");
});

router.get("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

module.exports = router;
