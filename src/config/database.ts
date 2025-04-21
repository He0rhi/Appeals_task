import { DataSource } from "typeorm";
import { Appeal } from "../entities/Appeal";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "postgres", 
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "appeals_db",
  synchronize: true,
  logging: true,
  entities: [Appeal],
});

let isInitialized = false;

export const initializeDB = async () => {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("Database connected!");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }
  return AppDataSource;
};