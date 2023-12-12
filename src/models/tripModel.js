import mongoose from "mongoose";

const tripCollection = "trips";

const tripSchema = new mongoose.Schema({
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
const TripModel = mongoose.model(tripCollection, tripSchema);

export default TripModel;
