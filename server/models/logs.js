import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
// const tableName = process.env.TABLE_CATEGORIES;
export const UserLogs = new EntitySchema({
    name: "UserLogs",
    tableName: "ins_userlogs",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        action: {
            type: "varchar",
        },
        status:{
            type:Boolean
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
    },
    relations: {
        userlogged: {
            target: "User",
            type: "many-to-one",
            joinColumn: true,
            eager: true, 
            onDelete: "CASCADE",
        },
    },
});