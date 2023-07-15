import express from "express"
import { createUser } from "../controllers/user.js"
import { validate, validateUser } from "../middlewares/validator.js"


const router = express.Router()

router.post('/create', validateUser, validate, createUser )

export default router