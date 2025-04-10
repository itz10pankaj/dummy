import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const tableName = process.env.TABLE_MENUS;
export const Menu = new EntitySchema({
    name: "Menu",
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
        course: {
            target: "Course",
            type: "many-to-one",
            joinColumn: true,
        },
        contents: {
            target: "Content",
            type: "one-to-many",
            inverseSide: "menu",
        },
        images: {
            type: "one-to-many",
            target: "Image",
            inverseSide: "menu",
        },
    },
});
