import express from "express"
import { createUser, signin } from "../controllers/user.js"
import { validate, validateUser } from "../middlewares/validator.js"


const router = express.Router()

router.post('/create', validateUser, validate, createUser )
router.post('/signin', signin )

export default router