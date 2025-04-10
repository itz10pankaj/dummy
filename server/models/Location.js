import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const tableName = process.env.TABLE_LOCATIONS;
export const Location = new EntitySchema({
    name: "Location",
    tableName: tableName,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        latitude: {
            type: "double precision",
            nullable: false,
        },
        longitude: {
            type: "double precision",
            nullable: false,
        },
        label: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        status: {
            type: "bool",
            default: true,
        },
    },
});
