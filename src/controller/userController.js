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
    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

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
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Hubo un error', error: err })
  }
};


export const Register = async (req, res) => {
  try {
    const user = req.body;
    user.password = createHash(user.password)

    const existingUser = await userModel.findOne({ email: user.email })
    

    if (existingUser) {
      console.log("usuario ya registrado")
      return res.status(409).json({
        message: 'El correo ya está registrado',
        email_: false
      });
    }

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
      
      const token = jwt.sign(
        { email: user.email },
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: '24h',
        }
      );

      const newUser = await new UserModel({
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        image: downloadURL,
        password: user.password,
        role:user.role
      }).save()

      const data = {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        lastname: newUser.lastname,
        phone: newUser.phone,
        image: downloadURL,
        password: newUser.password,
        role:newUser.role,
        session_token: `JWT ${token}`
      }

      return res.status(201).json({
        success: true,
        message: 'El registro se realizó correctamente',
        data: data
      });

    }
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

export const UpdateUserWithImage = async (req, res) => {
  try {
    const dirver = req.body;
    const image = req.files.image;

    console.log(dirver)


    if (image && image.length > 0) {
      const { downloadURL } = await uploadFile(image[0]);

      const existingUser = await UserModel.findOne({ email: user.email });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró el conductor con el correo electrónico proporcionado',
        });
      }

      existingUser.name = user.name || existingUser.name;
      existingUser.lastname = user.lastname || existingUser.lastname;
      existingUser.phone = user.phone || existingUser.phone;
      existingUser.image = downloadURL || existingUser.image;

      await existingUser.save();

      const userData = await UserModel.findOne({ email: user.email })

      const data = {
        id: userData._id,
        email: userData.email,
        name: userData.name,
        lastname: userData.lastname,
        phone: userData.phone,
        image: userData.image,
        session_token: user.session_token
      }

      return res.status(201).json({
        success: true,
        message: 'El usuario se actualizó correctamente',
        data: data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Se requiere una imagen para actualizar el usuario',
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Hubo un error al procesar la solicitud de actualización del conductor',
      error: err,
    });
  }
};


export const UpdateUserWithoutImage = async (req, res) => {
  try {
    const user = req.body;
    const existingUser = await UserModel.findOne({ email: user.email });

    console.log(user)
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el conductor con el correo electrónico proporcionado',
      });
    }

    existingUser.name = user.name || existingUser.name;
    existingUser.lastname = user.lastname || existingUser.lastname;
    existingUser.phone = user.phone || existingUser.phone;

    await existingUser.save();

    const userData = await UserModel.findOne({ email: user.email })

    const data = {
      id: userData._id,
      email: userData.email,
      name: userData.name,
      lastname: userData.lastname,
      phone: userData.phone,
      image: userData.image,
      session_token:user.session_token
    }

    return res.status(201).json({
      success: true,
      message: 'El conductor se actualizó correctamente',
      data: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Hubo un error al procesar la solicitud de actualización del conductor',
      error: err,
    });
  }
};