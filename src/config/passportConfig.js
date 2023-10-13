import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/usersModel.js';
import dotenv from 'dotenv'


dotenv.config()
const configurePassport = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_PRIVATE_KEY,
  };


  passport.use(
    new Strategy(opts, async (jwt_payload, done) => {
      try {
        const user = await UserModel.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

export default configurePassport;
