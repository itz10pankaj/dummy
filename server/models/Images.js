import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const tableName = process.env.TABLE_IMAGES;
export const Image = new EntitySchema({
    name:"Image",
    tableName:tableName,
    columns:{
        id:{
            primary:true,
            type:"int",
            generated:true,
        },
        imageUrl:{
            type:"varchar",
            length:255,
            nullable:false,
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
    relations:{
        menu: {
            type: "many-to-one",
            target: "Menu",
            joinColumn: { name: "menu_id" },
            onDelete: "CASCADE",
        },
    }
})