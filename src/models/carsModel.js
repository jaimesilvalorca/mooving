import mongoose from "mongoose";

const carCollection = "cars";

const carSchema = new mongoose.Schema({
    make: {
        type: String,
        default: null
    },
    modelCar: {
        type: String,
        default: null
    },
    year: {
        type: Number,
        default: null
    },
    plate: {
        type: String,
        default: null
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
