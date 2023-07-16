import User from "../model/user.js"
import VerificationToken from '../model/verificationToken.js'
import ResetToken from '../model/resetToken.js'
import {createRandomBytes, sendError} from "../utils/helper.js"
import jwt from 'jsonwebtoken'
import { generateEmailTemplate, generateOTP, generatePasswordResetTemplate, mailTransport, plainEmailTemplate } from "../utils/mail.js"
import { isValidObjectId } from "mongoose"
import crypto from 'crypto'

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

  mailTransport().sendMail({
    from: 'emailverification@email.com',
    to: newUser.email,
    subject: 'Verify your email account',
    html: generateEmailTemplate(OTP)
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

export const verifyEmail = async (req, res) => {
  const {userId, otp} = req.body
  if(!userId || !otp.trim()) return sendError(res, 'Invalid request, missing parameters!')

  if(!isValidObjectId(userId)) return sendError(res, 'Invalid user id!')

  const user = await User.findById(userId)
  if(!user) return sendError(res, 'Sorry, user not found!')

  if(user.verified) return sendError(res, 'This account is already verified!')

  const token = await VerificationToken.findOne({owner: user._id})
  if(!token) return sendError(res, 'Sorry, user not found!')

  const isMatched = await token.compareToken(otp)
  if(!isMatched) return sendError(res, 'Please provide a valid token!')

  user.verified = true
  await VerificationToken.findByIdAndDelete(token._id)
  await user.save()

  mailTransport().sendMail({
    from: 'emailverification@email.com',
    to: user.email,
    subject: 'Welcome email',
    html: plainEmailTemplate("Email Verified Successfully", "Thanks for connecting with us")
  })
  res.json({success: true, message: 'Your email has been verified!', user: {id: user._id, name: user.name, email: user.email}})
}

export const forgotPassword = async (req, res) => {
  const {email} = req.body
  if(!email) return sendError(res, 'Please provide a valid email!')

  const user = await User.findOne({email})
  if(!user) return sendError(res, 'User not found, invalid request!')

  const token = await ResetToken.findOne({owner: user._id})
  if(token) return sendError(res, 'Only after one hour you can request for another token!')

  const randomBytes = await createRandomBytes()
  const resetToken = new ResetToken({owner: user._id, token: randomBytes})
  await resetToken.save()

  mailTransport().sendMail({
    from: 'security@email.com',
    to: user.email,
    subject: 'Password Reset',
    html: generatePasswordResetTemplate(`http://localhost:5173/reset-password?token=${randomBytes}&id=${user._id}`)
  })

  res.json({success: true, message: 'Password reset link has been sent to your email!'})
}

export const resetPassword = async (req, res) => {
  const {password} = req.body

  const user = await User.findById(req.user._id)
  if(!user) return sendError(res, 'user not found')

  const isSamePassword = await user.comparePassword(password)
  if(isSamePassword) return sendError(res, 'New password must be different from the previous one!')

  if(password.trim().length < 8 || password.trim().length > 20) return sendError(res, 'Password must be 8 to 20 characters long!')

  user.password = password.trim()
  await user.save()

  await ResetToken.findOneAndDelete({owner: user._id})

  mailTransport().sendMail({
    from: 'security@email.com',
    to: user.email,
    subject: 'Password Reset Successfully',
    html: plainEmailTemplate('Password Reset Successfully', 'Now you can login with new password'),
  })
  res.json({success: true, message: 'Password Reset Successfully'})
}
