import { Router } from "express";
import { createTrip } from "../controller/tripController.js";


const router = Router();

router.post('/create',createTrip)


export default router