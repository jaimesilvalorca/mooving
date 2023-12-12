import { Router } from "express";
import { createTrip, fetchPendingTrip, updateTripDriver } from "../controller/tripController.js";


const router = Router();

router.post('/create',createTrip)
router.put('/putRequest',updateTripDriver)
router.get('/pending/:driverEmail', fetchPendingTrip);


export default router