import { createHash } from "../utils/hashPassword.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import DriverModel from '../models/driverModel.js';
import dotenv from 'dotenv'
import { uploadFile } from "../utils/uploadFile.js";
import CarModel from "../models/carsModel.js";

dotenv.config()

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const driver = await DriverModel.findOne({ email })

    if (!driver) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(password, driver.password)

    if (isPasswordValid) {
      const token = jwt.sign({ id: driver._id, email: driver.email }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '24h',
      });
      

      const data = {
        id: driver._id,
        name: driver.name,
        lastname: driver.lastname,
        email: driver.email,
        phone: driver.phone,
        image: driver.image,
        car: driver.car,
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
    const driver = req.body;
    driver.password = createHash(driver.password)

    const existingDriver = await DriverModel.findOne({ email: driver.email })
    const carForNewDriver = await CarModel.create({})
    driver.car = carForNewDriver._id
    

    if (existingDriver) {
      console.log("Conductor ya registrado")
      return res.status(409).json({
        message: 'El correo ya está registrado',
        email_: false
      });
    }

    const driverAdded = await DriverModel.create(driver);

    res.status(201).json({
      success: true,
      message: 'El registro se realizó correctamente',
      data: driverAdded
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
    const driver = req.body;
    const image = req.files.image
    driver.password = createHash(driver.password)

    console.log(driver)

    if (image && image.length > 0) {
      const { downloadURL } = await uploadFile(image[0])
      const existingDriver = await DriverModel.findOne({ email: driver.email });

      if (existingDriver) {
        console.log("usuario ya registrado")
        return res.status(409).json({
          message: 'El correo ya está registrado',
          email_: false
        });

      }
      const carForNewDriver = await CarModel.create({})

      const token = jwt.sign(
        { email: driver.email },
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: '24h',
        }
      );

      const newDriver = await new DriverModel({
        email: driver.email,
        name: driver.name,
        lastname: driver.lastname,
        phone: driver.phone,
        image: downloadURL,
        car: carForNewDriver._id,
        password: driver.password,
      }).save()

      console.log(newDriver)

      const data = {
        id: newDriver._id,
        email: newDriver.email,
        name: newDriver.name,
        lastname: newDriver.lastname,
        phone: newDriver.phone,
        image: downloadURL,
        car: newDriver.car._id,
        password: newDriver.password,
        session_token: `JWT ${token}`
      }

      return res.status(201).json({
        success: true,
        message: 'El registro se realizó correctamente',
        data: data
      });

    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: 'Hubo un error con el registro del usuario',
      error: err
    });
  }
}

export const getDrivers = async (req, res) => {
  try {
    const drivers = await DriverModel.find().lean().exec();

    return res.json(drivers)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hubo un error al obtener los usuarios',
      error: err
    });

  }

}