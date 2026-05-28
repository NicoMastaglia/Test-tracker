const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const swaggerUi = require("swagger-ui-express");
const swaggerPath = path.join(__dirname, "src", "swagger", "swagger.json");
function loadSwaggerDocument() {
  return JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
}

const mainRoutes = require("./src/routes/main");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const projectRoutes = require("./src/routes/projects");
const checklistRoutes = require("./src/routes/checklists");
const testSessionRoutes = require("./src/routes/testSessions");

app.use(express.json());
app.use(cors(corsOptions));

app.get("/swagger.json", (req, res) => {
  res.json(loadSwaggerDocument());
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/checklists", checklistRoutes);
app.use("/api/test-sessions", testSessionRoutes);
app.use("/", mainRoutes);

app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
  console.log(`Docs disponibile su http://localhost:${PORT}/api-docs`);
});
