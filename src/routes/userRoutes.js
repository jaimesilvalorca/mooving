import { Router } from "express";
import { Register, getUsers,Login,RegisterWithImage} from "../controller/userController.js"
import {upload} from '../config/multer.js'


const router = Router();

router.post('/create',Register)
router.get('/',getUsers)
router.post('/login', Login);
router.post('/createwithimage',upload.fields([{name:'image',maxCount:1}]),RegisterWithImage)


export default router