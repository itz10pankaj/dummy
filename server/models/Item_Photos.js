import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const tableName = process.env.TABLE_ITEM_PHOTOS;
export const Photo = new EntitySchema({
  name: "Photo",
  tableName:tableName,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    url: {
      type: "varchar",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    item: {
      target: "Item",
      type: "many-to-one",
      joinColumn: {name:"item_id"},
      onDelete: "CASCADE",
    },
  },
});
