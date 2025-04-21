import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import { swaggerSpec } from './utils/swagger';
import swaggerUi from 'swagger-ui-express';
import { initializeDB } from "./config/database";
import appealsRouter from "./routes/appeals";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/appeals", appealsRouter);

const PORT = process.env.PORT || 5000;

app.use(async (req, res, next) => {
  try {
    await initializeDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});


initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});