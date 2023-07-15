import User from "../model/user.js"

export const createUser = (req, res) => {
  const {name, email, password} = req.body
  const newUser = new User({
    name,
    email,
    password
  })
  res.send(newUser)
}