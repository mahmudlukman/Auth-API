import express from "express"
import { createUser, signin, verifyEmail } from "../controllers/user.js"
import { validate, validateUser } from "../middlewares/validator.js"


const router = express.Router()

router.post('/create', validateUser, validate, createUser )
router.post('/signin', signin )
router.post('/verify-email', verifyEmail )

export default router