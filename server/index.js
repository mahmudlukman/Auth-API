import express from "express"
import './db/index.js'
import userRouter from './routes/user.js'


const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000

app.use('/api/user', userRouter)

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`)
})