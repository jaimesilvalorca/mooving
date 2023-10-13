import { Router } from "express";
import { Register, getUsers,Login } from "../controller/userController.js"

const router = Router()

router.post('/create',Register)
router.get('/',getUsers)
router.post('/login', Login);

export default router