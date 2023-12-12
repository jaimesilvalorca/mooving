import { Router } from "express";
import { acceptTrip, cancelTrip, completeTrip, createTrip, fetchPendingTrip, getCompletedTrips, getTripById, updateTripDriver } from "../controller/tripController.js";


const router = Router();

router.get('/completed', getCompletedTrips);
router.post('/create',createTrip)
router.put('/putRequest',updateTripDriver)
router.get('/pending/:driverEmail', fetchPendingTrip);
router.put('/cancel/:tripId', cancelTrip);
router.put('/accept/:tripId', acceptTrip);
router.put('/complete/:tripId', completeTrip);
router.get('/:tripId', getTripById);


export default router