import { Router } from "express";
import { Register, RegisterWithImage, Login, getDrivers, UpdateDriverWithImage,UpdateDriverWithoutImage } from "../controller/driverController.js";
import { upload } from '../config/multer.js'

const router = Router();

router.post('/create', Register)
router.get('/', getDrivers)
router.post('/login', Login);
router.post('/createwithimage', upload.fields([{ name: 'image', maxCount: 1 }]), RegisterWithImage)
router.put('/updatewithimage',upload.fields([{ name: 'image', maxCount: 1 }]),UpdateDriverWithImage)
router.put('/updatewithoutimage',UpdateDriverWithoutImage)



export default router