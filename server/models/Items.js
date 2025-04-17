import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const tableName = process.env.TABLE_ITEMS;
export const Item = new EntitySchema({
  name: "Item",
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
    latitude: {
        type: "varchar",
        nullable: true,
    },
    longitude: {
        type: "varchar",
        nullable: true,
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
  relations: {
    category: {
      target: "Category",
      type: "many-to-one",
      joinColumn: true,
      eager: true, // optional, for auto-fetch
      onDelete: "CASCADE",
    },
    photos: {
      target: "Photo",
      type: "one-to-many",
      inverseSide: "item",
      cascade: true,
    },
  },
});
