import { Router } from "express";
import { acceptTrip, cancelTrip, createTrip, fetchPendingTrip, updateTripDriver } from "../controller/tripController.js";


const router = Router();

router.post('/create',createTrip)
router.put('/putRequest',updateTripDriver)
router.get('/pending/:driverEmail', fetchPendingTrip);
router.put('/cancel/:tripId', cancelTrip);
router.put('/accept/:tripId', acceptTrip);


export default router