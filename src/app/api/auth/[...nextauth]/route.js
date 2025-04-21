import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { logMessage } from "../../../lib/logger";
import { User } from "../../../models/User";

const handler = NextAuth({
  secret: "lololololololol",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const username = credentials?.username;
        const password = credentials?.password;

        await mongoose.connect(process.env.MONGODB_URL);

        // Hardcoded admin bypasses DB logic
        if (username === "admin" && password === "admin123") {
          await logMessage("Admin has successfully logged in", "info", "");
          return {
            username: "admin",
            firstname: "Admin",
            lastname: "User",
            phone_number: "",
            address: "",
            zip_code: "",
            city: "",
            country: "",
            profile_picture: "",
            role: "admin",
          };
        } else if (username === 'admin' && password !== "admin123"){
          await logMessage(`A user tried to access the admin account`, "info", "");
        }

        const user = await User.findOne({ username });

        if (!user) return null;
        const now = new Date();

        // If account is locked
        if (user.isLocked && user.lockoutUntil && now < user.lockoutUntil) {
          await logMessage(`User ${user.username}'s account is temporarily locked`, "info", "");
          throw new Error("Account is temporarily locked. Try again later.");
        }

        if (user.isLocked && user.lockoutUntil && now >= user.lockoutUntil) {
          user.isLocked = false;
          user.failedLoginAttempts = 0;
          user.lockoutUntil = null;
          await logMessage(`Lockout on user ${user.username}'s account has been lifted`, "info", "");
          await user.save();
        }

        const passwordOk = bcrypt.compareSync(password, user.password);

        if (passwordOk) {
          user.failedLoginAttempts = 0;
          user.isLocked = false;
          user.lockoutUntil = null;
          user.lastSuccessfulLogin = now;
          await user.save();
          await logMessage(`User ${user.username} has logged in successfully`, "info", "");
          return user;
        } else {
          user.failedLoginAttempts += 1;

          if (user.failedLoginAttempts >= 5) {
            user.isLocked = true;
            user.lockoutUntil = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours
            user.lastUnsuccessfulLogin = now;
            await logMessage(`User ${user.username} is locked out until ${user.lockoutUntil}`, "info", "");
          }

          await user.save();
          await logMessage(`User ${user.username} log in failed`, "info", "");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.id = token.id;
      session.jwt = token.jwt;
      session.user.username = token.username;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.user.phone_number = token.phone_number;
      session.user.address = token.address;
      session.user.zip_code = token.zip_code;
      session.user.city = token.city;
      session.user.country = token.country;
      session.user.profile_picture = token.profile_picture;
      session.user.lastSuccessfulLogin = token.lastSuccessfulLogin;
      session.user.lastUnsuccessfulLogin = token.lastUnsuccessfulLogin;
      session.user.role = token.role;
      return Promise.resolve(session);
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.username = user.username;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.phone_number = user.phone_number;
        token.address = user.address;
        token.zip_code = user.zip_code;
        token.city = user.city;
        token.country = user.country;
        token.profile_picture = user.profile_picture;
        token.lastSuccessfulLogin = user.lastSuccessfulLogin;
        token.lastUnsuccessfulLogin = user.lastUnsuccessfulLogin;
        token.role = user.role;
      }
      return Promise.resolve(token);
    },
  },
});

export { handler as GET, handler as POST };
