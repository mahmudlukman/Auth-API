import express from "express"
import './db/index.js'


const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000

app.post('/api/user/create', (req, res) => {
  res.send(req.body)
})

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`)
})