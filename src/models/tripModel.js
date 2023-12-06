import mongoose from "mongoose";

const tripCollection = "trips";

const tripSchema = new mongoose.Schema({
    email: String,
    origin: String,
    destination: String,
    latitude: Number,
    longitude: Number,
    distance:String,
    amount:Number
});

mongoose.set("strictQuery", false);
const TripModel = mongoose.model(tripCollection, tripSchema);

export default TripModel;
