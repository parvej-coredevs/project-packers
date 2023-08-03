import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../services/user/user.schema";

export default function (passport, config) {
  // Serialize and deserialize user for session management
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // Configure the GoogleStrategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        // create or find user
        const user = await findOrCreateUser({
          full_name: profile.displayName,
          social_id: profile.id,
          provider: profile.provider,
          email: profile.emails[0].value,
        });
        return done(null, user);
      }
    )
  );

  // Configure FacebookStrategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: config.FACEBOOK_APP_SECRET,
        callbackURL: config.FACEBOOK_CALLBACK,
        profileFields: ["id", "displayName", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        // create or find new user
        const user = await findOrCreateUser({
          full_name: profile.displayName,
          social_id: profile.id,
          provider: profile.provider,
        });
        return done(null, user);
      }
    )
  );
}

async function findOrCreateUser(data) {
  try {
    let user = await User.findOne(data);

    // If the user doesn't exist, create a new user
    if (!user) {
      user = await User.create(data);
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}
