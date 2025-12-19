import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const configurePassport = (pool) => {
  const userModel = new User(pool);

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile:', profile);
      const email = profile.emails && profile.emails[0].value;
      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }

      // Check if user exists
      const user = await userModel.findByEmail(email);
      if (!user) {
        return done(new Error('Please register first'), null);
      }

      // Generate JWT token
      const token = generateJWT(user);

      // Pass the token back to the callback
      return done(null, { 
        ...user,
        token: token
      });
    } catch (error) {
      console.error('OAuth error:', error);
      return done(error, null);
    }
  }));

  // Serialize/deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  return passport;
};

// JWT generation function
function generateJWT(user) {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}