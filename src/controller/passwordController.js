import jwt from 'jsonwebtoken';
import emailService from '../services/emailService.js'
import { createHash, isValidPassword } from '../utils/hashPassword.js';
import dotenv from 'dotenv'
import DriverModel from '../models/driverModel.js';


dotenv.config()

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY

const resetPasswordController = {
  showResetPasswordPage: (req, res) => {
    res.render('reset-password');
  },

  sendResetPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const driver = await DriverModel.findOne({ email });

      if (!driver) {
        return res.render('reset-password', { error: 'Usuario no encontrado' });
      }

      const token = jwt.sign({ driver }, jwtPrivateKey, { expiresIn: '1h' });

      const resetLink = `http://localhost:3000/reset-password/${token}`;

      await emailService.sendPasswordResetEmail(driver.email, resetLink); // 
      res.render('reset-password-sent');
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      res.render('reset-password', { error: 'Error al enviar el correo de restablecimiento' });
    }
  },

  showResetPasswordForm: async (req, res) => {
    try {
      const token = req.params.token;
      const decodedToken = jwt.verify(token, jwtPrivateKey);
      if (!decodedToken || !decodedToken.driver) {
        return res.render('reset-password', { error: 'Token inválido' });
      }

      res.render('reset-password-form', { token });
    } catch (error) {
      console.error('Error al verificar el token:', error);
      res.render('reset-password', { error: 'Error al verificar el token' });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      const decodedToken = jwt.verify(token, jwtPrivateKey);
      if (!decodedToken || !decodedToken.driver) {
        return res.render('reset-password-form', { error: 'Token inválido' });
      }

      const driver = await DriverModel.findById(decodedToken.driver._id);
      if (!driver) {
        return res.render('reset-password-form', { error: 'Usuario no encontrado' });
      }

      if (isValidPassword(driver, newPassword)) {
        return res.render('reset-password-form', { error: 'No puedes usar la misma contraseña actual' });
      }

      driver.password = createHash(newPassword);
      await driver.save();

      res.render('reset-password-form', { success: 'Contraseña restablecida exitosamente' });
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      res.render('reset-password-form', { error: 'Error al restablecer la contraseña' });
    }
  }
};

export default resetPasswordController;

