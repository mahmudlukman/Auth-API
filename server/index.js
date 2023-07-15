import express from "express"
import './db/index.js'
import User from "./model/user.js"


const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000

app.post('/api/user/create', (req, res) => {
  const {name, email, password} = req.body
  const newUser = new User({
    name,
    email,
    password
  })
  res.send(newUser)
})

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`)
})