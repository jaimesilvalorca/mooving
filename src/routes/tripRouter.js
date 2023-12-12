import { Router } from "express";
import { acceptTrip, cancelTrip, completeTrip, createTrip, fetchPendingTrip, getCompletedTrips, getDriverTrips, getTripById, getUserTrips, updateTripDriver } from "../controller/tripController.js";


const router = Router();

router.get('/completed', getCompletedTrips);
router.post('/create',createTrip)
router.put('/putRequest',updateTripDriver)
router.get('/pending/:driverEmail', fetchPendingTrip);
router.put('/cancel/:tripId', cancelTrip);
router.put('/accept/:tripId', acceptTrip);
router.put('/complete/:tripId', completeTrip);
router.get('/:tripId', getTripById);
router.get('/completed/:userEmail', getUserTrips);
router.get('/completeddriver/:driverEmail', getDriverTrips);


export default router