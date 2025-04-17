import { AppDataSource } from "../config/data-source.js";
import { User } from "../models/User.js";
import { GraphQLUpload } from "graphql-upload";
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
    // uploadProfilePic: async (_, { file, email }) => {
    //   try {
    //     // 1. Validate input
    //     if (!file) throw new Error("No file provided");
    //     if (!email) throw new Error("Email is required");
    
    //     const uploadedFile = await file;
    //     const { createReadStream, filename, mimetype } = uploadedFile;
    
    //     // 2. Create graphql-specific upload directory if not exists
    //     const uploadDir = path.join("uploads", "graphql");
    //     if (!fs.existsSync(uploadDir)) {
    //       fs.mkdirSync(uploadDir, { recursive: true });
    //     }
    
    //     // 3. Generate unique filename and path
    //     const fileExt = path.extname(filename);
    //     const uniqueName = `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${fileExt}`;
    //     const filePath = path.join(uploadDir, uniqueName);
    //     const publicUrl = `/uploads/graphql/${uniqueName}`;
    
    //     // 4. Stream file to disk
    //     await new Promise((resolve, reject) => {
    //       const stream = createReadStream();
    //       const out = fs.createWriteStream(filePath);
          
    //       stream.on('error', reject);
    //       out.on('error', reject);
    //       out.on('finish', resolve);
          
    //       stream.pipe(out);
    //     });
    
    //     // 5. Update user in database
    //     const userRepo = AppDataSource.getRepository(User);
    //     const user = await userRepo.findOne({ where: { email } });
    //     if (!user) {
    //       // Cleanup uploaded file if user not found
    //       fs.unlinkSync(filePath);
    //       throw new Error("User not found");
    //     }
    
    //     // 6. Delete old profile pic if exists
    //     if (user.profilePic) {
    //       const oldFilePath = path.join("uploads", user.profilePic.replace('/uploads/', ''));
    //       if (fs.existsSync(oldFilePath)) {
    //         fs.unlinkSync(oldFilePath);
    //       }
    //     }
    
    //     user.profilePic = publicUrl;
    //     await userRepo.save(user);
    
    //     return {
    //       ...user,
    //       profilePicUrl: publicUrl // Return full public URL
    //     };
    
    //   } catch (error) {
    //     console.error("Profile pic upload failed:", error);
    //     throw new Error(`Failed to upload profile picture: ${error.message}`);
    //   }
    // },
  },
}