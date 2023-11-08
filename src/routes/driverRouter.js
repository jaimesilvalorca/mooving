import { Router } from "express";
import { Register, RegisterWithImage,Login, getDrivers } from "../controller/driverController.js";
import {upload} from '../config/multer.js'

const router = Router();

router.post('/create',Register)
router.get('/',getDrivers)
router.post('/login',Login);
router.post('/createwithimage',upload.fields([{name:'image',maxCount:1}]),RegisterWithImage)


export default router