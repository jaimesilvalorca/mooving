import userModel from "../models/usersModel.js";
import { createHash } from "../utils/hashPassword.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/usersModel.js';
import dotenv from 'dotenv'
import { uploadFile } from "../utils/uploadFile.js";
// import RolesModel from "../models/rolesModel.js";

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
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        image: user.image,
        role: user.role,
        session_token: `JWT ${token}`,
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
    // const {name,lastname,email,phone,password} = req.body   
    const user = req.body;
    user.password = createHash(user.password)

    const existingUser = await userModel.findOne({ email: user.email });

    if (existingUser) {
      console.log("usuario ya registrado")
      return res.status(409).json({
        message: 'El correo ya está registrado',
        email_: false
      });
    }
    // const rolesForNewUser = await RolesModel.create({})

    // const newUser = {
    //   name,
    //   lastname,
    //   email,
    //   phone,
    //   password: createHash(password),
    //   roles: rolesForNewUser._id,
    // }1
    // const result = await userModel.create(newUser)        
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

export const RegisterWithImage = async (req, res) => {
  try {
    // const {name,lastname,email,phone,password} = req.body   
    const user = req.body;
    const image = req.files.image
    user.password = createHash(user.password)

    if (image && image.length > 0) {
      const { downloadURL } = await uploadFile(image[0])
      const existingUser = await userModel.findOne({ email: user.email });

      if (existingUser) {
        console.log("usuario ya registrado")
        return res.status(409).json({
          message: 'El correo ya está registrado',
          email_: false
        });
      }

      const newUser = await new UserModel({
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        image: downloadURL,
        password: user.password

      }).save()

      return res.status(201).json({
        success: true,
        message: 'El registro se realizó correctamente',
        data: newUser
      });

    }


    // const rolesForNewUser = await RolesModel.create({})

    // const newUser = {
    //   name,
    //   lastname,
    //   email,
    //   phone,
    //   password: createHash(password),
    //   roles: rolesForNewUser._id,
    // }1
    // const result = await userModel.create(newUser)        

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Hubo un error con el registro del usuario',
      error: err
    });
  }
}

export const getUsers = async (req, res) => {
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