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
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
  },
  logging: process.env.NODE_ENV === 'dev' ? console.log : false,
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected successfully");
    
    await sequelize.sync({ 
      force: false,
      alter: true 
    });
    console.log("✅ Database tables synchronized");
    
  } catch (err) {
    console.error("❌ DB connection error:", err);
    throw err;
  }
};

export default sequelize;