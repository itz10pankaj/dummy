import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const tableName = process.env.TABLE_META_TITLE;
export const MetaTitle=new EntitySchema({
    name:"MetaTitle",
    tableName:tableName,
    columns:{
        id:{
            primary:true,
            type:"int",
            generated:true,
        },
        page:{
            unique:true,
            type:"varchar"
        },
        title:{
            type:"varchar"
        },
        createdAt:{
            type:"timestamp",
            createDate:true,
        },
        status:{
            type:"bool",
            default:true
        }
    }
})