import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const tableName = process.env.TABLE_CATEGORIES;
export const Category = new EntitySchema({
    name: "Category",
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
        items: {
            target: "Item",
            type: "one-to-many",
            inverseSide: "category",
        },
    },
});