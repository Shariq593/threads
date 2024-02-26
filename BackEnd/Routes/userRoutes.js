import express from "express"
import singUpUser from "../Controller/userController.js"

const router = express.Router()

router.get("/signup" , singUpUser)

export default router