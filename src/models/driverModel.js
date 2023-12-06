import mongoose, { Schema } from "mongoose";

const driverCollection = "drivers";

const driverSchema = new mongoose.Schema({
    email: String,
    name: String,
    lastname: String,
    phone: String,
    car:{
        type:Schema.Types.ObjectId,
        ref: 'cars'
    },
    image: {
        type: String,
        default: null
    },
    password: String,
    role:{
        type:String,
        default: 'user'
    },
    status:{
        type:Boolean,
        default:false
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    con:{
        type:Boolean,
        default:false
    },
});

mongoose.set("strictQuery", false);
const DriverModel = mongoose.model(driverCollection, driverSchema);

export default DriverModel;
