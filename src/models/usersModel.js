import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    lastname: String,
    phone: String,
    image: {
        type: String,
        default: null
    },
    password: String,
    role:{
        type:String,
        default: 'user'
    },
    // roles:{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "roles"
    //     },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    session_token:String
});

mongoose.set("strictQuery", false);
const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;
