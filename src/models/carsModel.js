import mongoose from "mongoose";

const carCollection = "cars";

const carSchema = new mongoose.Schema({
    make: {
        type: String,
        default: ''
    },
    modelCar: {
        type: String,
        default: ''
    },
    year: {
        type: String,
        default: ''
    },
    plate: {
        type: String,
        default: ''
    },

    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});

mongoose.set("strictQuery", false);
const CarModel = mongoose.model(carCollection, carSchema);

export default CarModel;
