import { Router } from "express";
import { Register, getUsers } from "../controller/userController.js"

const router = Router()

router.post('/create',Register)
router.get('/',getUsers)

export default router