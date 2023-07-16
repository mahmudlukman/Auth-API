import User from "../model/user.js"
import VerificationToken from '../model/verificationToken.js'
import {sendError} from "../utils/helper.js"
import jwt from 'jsonwebtoken'
import { generateOTP } from "../utils/mail.js"

export const createUser = async (req, res) => {
  const {name, email, password} = req.body
  const user = await User.findOne({email})
  if(user) return sendError(res, 'User already exist!')

  const newUser = new User({
    name,
    email,
    password
  })
  const OTP = generateOTP()
  const verificationToken = new VerificationToken({
    owner: newUser._id,
    token: OTP
  })

  await verificationToken.save()
  await newUser.save()
  res.send(newUser)
}

export const signin = async (req, res) => {
  const {email, password} = req.body
  if(!email.trim() || !password.trim()) return sendError(res, 'email/password missing!')

  const user = await User.findOne({email})
  if(!user) return sendError(res, 'User not found')

  const isMatched = await user.comparePassword(password)
  if(!isMatched) return sendError(res, 'email/password does not match')

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })
  res.json({success:true, user: {id: user._id, name: user.name, email: user.email, token}})
}
