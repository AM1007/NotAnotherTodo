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
      rejectUnauthorized: false // Важно для Render.com
    },
  },
  logging: process.env.NODE_ENV === 'dev' ? console.log : false, // Логи только в dev режиме
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected successfully");
    
    // Синхронизируем все модели
    await sequelize.sync({ 
      force: false, // НЕ удалять существующие таблицы
      alter: true   // Обновлять структуру если нужно
    });
    console.log("✅ Database tables synchronized");
    
  } catch (err) {
    console.error("❌ DB connection error:", err);
    throw err;
  }
};

export default sequelize;