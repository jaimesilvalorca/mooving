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

    const carDriver = await CarModel.findOne(driver.car)

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
        car: {
          _id: carDriver._id,
          make: carDriver.make,
          modelCar: carDriver.modelCar,
          year: carDriver.year,
          plate: carDriver.plate
        },
        con:driver.con,
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
        con:driver.con,
      }).save()

      const carDriver = await CarModel.findOne(newDriver.car)

      console.log(newDriver)

      const data = {
        id: newDriver._id,
        email: newDriver.email,
        name: newDriver.name,
        lastname: newDriver.lastname,
        phone: newDriver.phone,
        image: downloadURL,
        car: {
          id: carDriver._id,
          make: carDriver.make,
          modelCar: carDriver.modelCar,
          year: carDriver.year,
          plate: carDriver.plate
        },
        password: newDriver.password,
        con:newDriver.con,
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

    return res.json({
      sucess: true,
      message: 'Entrega de todos los registros',
      data: drivers
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hubo un error al obtener los usuarios',
      error: err
    });

  }

}

export const UpdateDriverWithImage = async (req, res) => {
  try {
    const driver = req.body;
    const image = req.files.image;

    console.log(driver)


    if (image && image.length > 0) {
      const { downloadURL } = await uploadFile(image[0]);

      const existingDriver = await DriverModel.findOne({ email: driver.email });

      if (!existingDriver) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró el conductor con el correo electrónico proporcionado',
        });
      }

      existingDriver.name = driver.name || existingDriver.name;
      existingDriver.lastname = driver.lastname || existingDriver.lastname;
      existingDriver.phone = driver.phone || existingDriver.phone;
      existingDriver.image = downloadURL || existingDriver.image;

      await existingDriver.save();

      const driverData = await DriverModel.findOne({ email: driver.email })
      const driverCar = await CarModel.findOne({ _id: driverData.car })

      const data = {
        id: driverData._id,
        email: driverData.email,
        name: driverData.name,
        lastname: driverData.lastname,
        phone: driverData.phone,
        image: driverData.image,
        car: {
          id: driverCar._id,
          make: driverCar.make,
          modelCar: driverCar.modelCar,
          year: driverCar.year,
          plate: driverCar.plate
        },
        con:driverData.con,
        session_token: driver.session_token
      }

      return res.status(201).json({
        success: true,
        message: 'El conductor se actualizó correctamente',
        data: data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Se requiere una imagen para actualizar el conductor',
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


export const UpdateDriverWithoutImage = async (req, res) => {
  try {
    const driver = req.body;
    const existingDriver = await DriverModel.findOne({ email: driver.email });

    console.log(driver)
    if (!existingDriver) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el conductor con el correo electrónico proporcionado',
      });
    }

    existingDriver.name = driver.name || existingDriver.name;
    existingDriver.lastname = driver.lastname || existingDriver.lastname;
    existingDriver.phone = driver.phone || existingDriver.phone;

    await existingDriver.save();

    const driverData = await DriverModel.findOne({ email: driver.email })
    const driverCar = await CarModel.findOne({ _id: driverData.car })

    const data = {
      id: driverData._id,
      email: driverData.email,
      name: driverData.name,
      lastname: driverData.lastname,
      phone: driverData.phone,
      image: driverData.image,
      car: {
        id: driverCar._id,
        make: driverCar.make,
        modelCar: driverCar.modelCar,
        year: driverCar.year,
        plate: driverCar.plate
      },
      con:driverData.con,
      session_token:driver.session_token
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

export const UpdateDriverConnectionStatus = async (req, res) => {
  try {
    const { email } = req.body;
    const existingDriver = await DriverModel.findOne({ email });

    if (!existingDriver) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el conductor con el correo electrónico proporcionado',
      });
    }

    existingDriver.con = !existingDriver.con;

    await existingDriver.save();

    const driverData = await DriverModel.findOne({ email });
    const driverCar = await CarModel.findOne({ _id: driverData.car });

    const data = {
      id: driverData._id,
      email: driverData.email,
      name: driverData.name,
      lastname: driverData.lastname,
      phone: driverData.phone,
      image: driverData.image,
      car: {
        id: driverCar._id,
        make: driverCar.make,
        modelCar: driverCar.modelCar,
        year: driverCar.year,
        plate: driverCar.plate,
      },
      con: existingDriver.con,
      session_token: driverData.session_token,
    };

    return res.status(200).json({
      success: true,
      message: 'Se actualizó correctamente el estado de conexión del conductor',
      data: data,
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


export const getConnectedDrivers = async (req, res) => {
  try {

    const connectedDrivers = await DriverModel.find({ con: true }).lean().exec();

    const driversData = await Promise.all(
      connectedDrivers.map(async (driver) => {
        const driverCar = await CarModel.findOne({ _id: driver.car });

        return {
          id: driver._id,
          email: driver.email,
          name: driver.name,
          lastname: driver.lastname,
          phone: driver.phone,
          image: driver.image,
          car: {
            id: driverCar._id,
            make: driverCar.make,
            modelCar: driverCar.modelCar,
            year: driverCar.year,
            plate: driverCar.plate,
          },
          con: driver.con,
          session_token: driver.session_token,
        };
      })
    );

    return res.json({
      success: true,
      message: 'Lista de conductores conectados',
      data: driversData,
    });
  } catch (error) {

    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Hubo un error al obtener la lista de conductores conectados',
      error: error,
    });
  }
};


export const updateCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const { make, modelCar, year, plate } = req.body;
    const car = await CarModel.findByIdAndUpdate(
      carId,
      { make, modelCar, year, plate },
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).send('Car not found');
    }

    res.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).send('Error updating car');
  }
};

export default updateCar;