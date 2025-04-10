import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const tableName = process.env.TABLE_COURSES;
export const Course = new EntitySchema({
    name: "Course",
    tableName: tableName,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            unique: true,
        },
        createdAt:{
            type:"timestamp",
            createDate:true,
        },
        status:{
            type:"bool",
            default:true
        }
    },
    relations: {
        menus: {
            target: "Menu",
            type: "one-to-many",
            inverseSide: "course",
        },
    },
});
