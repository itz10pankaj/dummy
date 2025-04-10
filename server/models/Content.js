import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const tableName = process.env.TABLE_CONTENT;
console.log("tableName", tableName);
export const Content = new EntitySchema({
    name: "Content",
    tableName: tableName,
    // tableName:process.env.TABLE_CONTENT
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        text: {
            type: "text",
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
        menu: {
            target: "Menu",
            type: "many-to-one",
            joinColumn:{
                name: "menu_id", 
            },
        },
    },
});
