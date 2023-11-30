import { Router } from "express";
import { Register, RegisterWithImage, Login, getDrivers, UpdateDriverWithImage,UpdateDriverWithoutImage } from "../controller/driverController.js";
import { upload } from '../config/multer.js'
import passport from "passport";

const router = Router();

router.post('/create', Register)
router.get('/', getDrivers)
router.post('/login', Login);
router.post('/createwithimage', upload.fields([{ name: 'image', maxCount: 1 }]), RegisterWithImage)
router.put('/updatewithimage',passport.authenticate('jwt', { session: false }),upload.fields([{ name: 'image', maxCount: 1 }]),UpdateDriverWithImage)
router.put('/updatewithoutimage',passport.authenticate('jwt', { session: false }),UpdateDriverWithoutImage)



export default router