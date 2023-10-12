import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    lastname: String,
    phone:String,
    image:{
        type:String,
        default: ""
    },
    password: String,
    created_at: {
         type: Date, 
         default: Date.now 
        },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
});

mongoose.set("strictQuery", false);
const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;
