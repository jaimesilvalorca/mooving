import { Router } from "express";
import { Register, getUsers,Login, RegisterWithImage } from "../controller/userController.js"
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })


router.post('/create',Register)
router.get('/',getUsers)
router.post('/login', Login);
router.post('/createwithimage',upload.array('image', 1),RegisterWithImage)

export default router