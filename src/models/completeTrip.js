import mongoose from "mongoose";

const completeTripsCollection = "completeTrips";

const completeTripSchema = new mongoose.Schema({
    userEmail: String,
    driverEmail:{
        type:String,
        default:null
    },
    origin: String,
    destination: String,
    originLatitude:Number, 
    originLongitude:Number,
    destinationLatitude:Number, 
    destinationLongitude:Number,
    distance:String,
    amount:Number,
    estado:String,
});

mongoose.set("strictQuery", false);
const CompleteTripModel = mongoose.model(completeTripsCollection, completeTripSchema);

export default CompleteTripModel;
