import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../db.js"; // tu conexión a SQL

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth//callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Buscar usuario
        const result = await pool.query(
          "SELECT * FROM users WHERE email = @email",
          { email }
        );

        let user;

        if (result.recordset.length === 0) {
          // Crear usuario
          const newUser = await pool.query(
            `INSERT INTO users (full_name, email, google_id)
             OUTPUT INSERTED.*
             VALUES (@name, @email, @google_id)`,
            {
              name,
              email,
              google_id: profile.id
            }
          );

          user = newUser.recordset[0];
        } else {
          user = result.recordset[0];
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
