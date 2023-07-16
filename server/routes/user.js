import express from "express"
import { createUser, forgotPassword, resetPassword, signin, verifyEmail } from "../controllers/user.js"
import { validate, validateUser } from "../middlewares/validator.js"
import { isResetTokenValid } from "../middlewares/user.js"


const router = express.Router()

router.post('/create', validateUser, validate, createUser )
router.post('/signin', signin )
router.post('/verify-email', verifyEmail )
router.post('/forgot-password', forgotPassword )
router.post('/reset-password', isResetTokenValid, resetPassword )

export default router