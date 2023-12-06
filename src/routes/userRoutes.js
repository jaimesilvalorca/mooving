import { Router } from "express";
import { Register, getUsers,Login,RegisterWithImage,UpdateUserWithImage,UpdateUserWithoutImage} from "../controller/userController.js"
import {upload} from '../config/multer.js'


const router = Router();

router.post('/create',Register)
router.get('/',getUsers)
router.post('/login', Login);
router.post('/createwithimage',upload.fields([{name:'image',maxCount:1}]),RegisterWithImage)
router.put('/updatewithimage',upload.fields([{ name: 'image', maxCount: 1 }]),UpdateUserWithImage)
router.put('/updatewithoutimage',UpdateUserWithoutImage)

export default router