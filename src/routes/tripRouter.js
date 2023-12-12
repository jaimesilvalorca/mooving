import { Router } from "express";
import { createTrip, fetchPendingTrip, updateTripDriver } from "../controller/tripController.js";


const router = Router();

router.post('/create',createTrip)
router.put('/putRequest',updateTripDriver)
router.get('/fetchpendingtrip',fetchPendingTrip)


export default router