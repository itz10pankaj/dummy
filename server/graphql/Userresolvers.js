import { AppDataSource } from "../config/data-source.js";
import { User } from "../models/User.js";
import { GraphQLUpload } from "graphql-upload";
import { responseHandler } from "../utlis/responseHandler.js";
import fs from "fs";
import path from "path";
export const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        getAllUsers: async () => {
            const userRepo = AppDataSource.getRepository(User);
            return await userRepo.find();
        },
    },

    Mutation: {
    addUser: async (_, args) => {
      const userRepo = AppDataSource.getRepository(User);
      const existingUser = await userRepo.findOne({ where: { email: args.email } });

      if (existingUser) {
        throw new Error('Email already in use');
      }
      const newUser = userRepo.create({
        name: args.name,
        email: args.email,
        password: args.password || null,
        role: args.role || "user",
        latitude: args.latitude || null,
        longitude: args.longitude || null,
        profilePic: args.profilePic || null,
      });

      await userRepo.save(newUser);
      return newUser;
    },
    uploadProfilePic: async (_, { file, email }) => {
        const uploadedFile = await file; 

        const { createReadStream, filename, mimetype } = uploadedFile;

  
        // if (!mimetype.startsWith("image/")) {
        //   throw new Error("Only image files are allowed!");
        // }
  
        const uniqueName = `${Date.now()}-${filename}`;
        const filePath = path.join("uploads", uniqueName);
  
        await new Promise((resolve, reject) => {
          const stream = createReadStream();
          const out = fs.createWriteStream(filePath);
          stream.pipe(out);
          out.on("finish", resolve);
          out.on("error", reject);
        });
  
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { email } });
        if (!user) throw new Error("User not found");
  
        user.profilePic = `/uploads/${uniqueName}`;
        await userRepo.save(user);
  
        return user;
      },
  },
}