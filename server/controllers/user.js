import User from "../model/user.js"

export const createUser = async (req, res) => {
  const {name, email, password} = req.body
  const user = await User.findOne({email})
  if(user) res.status(400).json({success: false, message: 'User already exist!'})
  
  const newUser = new User({
    name,
    email,
    password
  })
  await newUser.save()
  res.send(newUser)
}