import express, { Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"

import { notFound, errorHandler } from "./middleware/errorHandler"
import { connectDb } from "./db/sequelize"

import { initializeModels, setupAssociations } from "./db/associations"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(morgan("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong")
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.use(notFound)
app.use(errorHandler)

const start = async () => {
  try {
    await initializeModels()
    setupAssociations()
    await connectDb()

    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`)
    })
  } catch (e: any) {
    console.log("server error", e)
    process.exit(1)
  }
}

start()

export default app
