import express from "express"
import './db/index.js'
import dotenv from 'dotenv'
import userRouter from './routes/user.js'


const app = express()
app.use(express.json())
dotenv.config()

const PORT = process.env.PORT || 5000

app.use('/api/user', userRouter)

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`)
})