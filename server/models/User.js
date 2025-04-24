import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();    
const tableName = process.env.TABLE_USERS; 
export const User = new EntitySchema({
    name: "User",
    tableName: tableName,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        email: {
            type: "varchar",
            unique: true,
        },
        password: {
            type: "varchar",
            nullable: true, // Allow password to be null
        },
        role: {
            type: "enum",
            enum: ["admin", "user"],
            default: "user",
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        status: {
            type: "bool",
            default: true
        },
        latitude: {
            type: "varchar",
            nullable: true,
        },
        longitude: {
            type: "varchar",
            nullable: true,
        },
        profilePic:{
            type: "varchar",
            nullable: true,
        }
    },
    relations: {
        logs: {
            target: "UserLogs",
            type: "one-to-many",
            inverseSide: "userlogged",
        },
    },
});
