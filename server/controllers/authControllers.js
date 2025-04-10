import bcrypt from "bcrypt";
import { AppDataSource } from "../config/data-source.js"
import { User } from "../models/User.js"
import { OAuth2Client } from "google-auth-library";
import { responseHandler } from "../utlis/responseHandler.js";
import dotenv from "dotenv";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const saltRounds = 10;

// Register User
export const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password.toString(), saltRounds);

        const userRepository = AppDataSource.getRepository(User);
        const newUser = userRepository.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || "user",
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        });

        const savedUser = await userRepository.save(newUser);
        console.log("User Registered:", savedUser);
        return res.status(201).json({ Status: "Success", insertedId: savedUser.id });
        // return responseHandler.success(res, { insertedId: savedUser.id }, "User Registered", 201);
    } catch (err) {
        console.error("Error in registerUser:", err);
        // return res.status(500).json({ Error: "Server Error" });
        return responseHandler.error(res, err, "Server Error", 500);
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: req.body.email });

        if (!user) {
            // return res.status(401).json({ Error: "User not found" });
            return responseHandler.notFound(res, "User not found", 404);
        }

        const isMatch =  await bcrypt.compare(req.body.password.toString(), user.password);
        if (!isMatch) {
            // return res.status(401).json({ Error: "Invalid Credentials" });
            return responseHandler.unauthorized(res, "Invalid Credentials", 401);
        }
        user.latitude = req.body.latitude;
        user.longitude = req.body.longitude;
        await userRepository.save(user); // Save updated location if needed
        console.log("Login Successful:", user.email);
        console.log(user);
        const cookieUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          latitude: user.latitude,
          longitude: user.longitude,
        };
        // Set cookie with user data
        console.log("JSON version:", JSON.stringify({
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          latitude: user.latitude,
          longitude: user.longitude,
        }));
                
        if(user) {
        res.cookie("user", JSON.stringify(cookieUser), 
            {
            path: "/",
            maxAge: 24 * 60 * 60 * 1000, 
            httpOnly: false, 
            // secure: process.env.NODE_ENV === "production",
            secure: false,
            sameSite: "strict",
        });
      }

        return res.status(200).json({ Status: "Success", user });
        // return responseHandler.success(res, user, "Login Successful", 200);

    } catch (error) {
        console.error("Error in loginUser:", error);
        // return res.status(500).json({ Error: "Server error" });
        return responseHandler.error(res, error, "Server error", 500);
    }
};

export const googleLogin = async (req, res) => {
    try {
      const { token, latitude, longitude } = req.body;
  
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      const { email, name } = payload;
  
      const userRepository = AppDataSource.getRepository(User);
  
      let user = await userRepository.findOneBy({ email });
  
      if (!user) {
        // Register the user if not found
        user = userRepository.create({
          name,
          email,
          password:null,
          role: "user",
          latitude,
          longitude,
        });
        await userRepository.save(user);
      }
  
      res.cookie("user", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        latitude: user.latitude,
        longitude: user.longitude,
      }), {
        path: "/",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: false, 
            // secure: process.env.NODE_ENV === "production",
            secure: false,
            sameSite: "strict",
      });
      
      return res.status(200).json({ Status: "Success", user });
      // return responseHandler.success(res, user, "Google Login Successful", 200);

    } catch (error) {
      console.error("Google Login Error:", error);
      // res.status(500).json({ Error: "Server Error" });
      return responseHandler.error(res, error, "Server Error", 500);
    }
  };


export const getAllUsers=async (req,res)=>{
  try{
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ["id", "name", "email"]
    });
    console.log("All Users:", users);
    // return res.status(200).json({ Status: "Success", users });
    return responseHandler.success(res, users, "All Users", 200);
  }
  catch (error) {
    console.error("Error in getAllUsers:", error);
    // return res.status(500).json({ Error: "Server Error" });
    return responseHandler.error(res, error, "Server Error", 500);
  }
}