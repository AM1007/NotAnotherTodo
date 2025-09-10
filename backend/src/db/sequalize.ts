import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres", 
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "todos",
  port: Number(process.env.DB_PORT) || 5432,
  dialectOptions: {
    ssl: true,
  },
});


export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log(" DB connected successfully");
  } catch (err) {
    console.error("DB connection error:", err);
    throw err;
  }
};

export default sequelize;