import userModel from "../models/usersModel.js";
import { createHash } from "../utils/hashPassword.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/usersModel.js';
import dotenv from 'dotenv'

dotenv.config()

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '24h',
      });
      const data = {
        id:user._id,
        name:user.name,
        lastname:user.lastname,
        email:user.email,
        phone:user.phone,
        image:user.image,
        session_token: `JWT ${token}`
      }
      return res.json({
        success: true, 
        message: 'Inicio de sesión exitoso', 
        data: data
      });
    } else {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Hubo un error', error: err });
  }
};


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