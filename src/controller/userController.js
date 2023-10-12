import userModel from "../models/usersModel.js";
import { createHash } from "../utils/hashPassword.js";

export const Register = async (req, res) => {
    try {
        const user = req.body;
        user.password = createHash(user.password)
        const userAdded = await userModel.create(user);
        res.status(201).json({
            success: true,
            message: 'El registro se realizó correctamente',
            data: userAdded
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Hubo un error con el registro del usuario',
            error: err
        });
    }
}


export const getUsers = async (req,res)=>{
    try {
        const users = await userModel.find().lean().exec();

        return res.json(users)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Hubo un error al obtener los usuarios',
            error: err
        });
       
    }

}