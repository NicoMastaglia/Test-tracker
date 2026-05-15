const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/swagger/swagger");

const mainRoutes = require("./src/routes/main");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/", mainRoutes);

app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
  console.log(`Docs disponibile su http://localhost:${PORT}/api-docs`);
});
