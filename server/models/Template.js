import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

// const tableName = process.env.TABLE_TEMPLATES || "templates";

export const Template = new EntitySchema({
  name: "Template",
  tableName: "ins_templates",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fileName: {
      type: "varchar",
    },
    content: {
      type: "longtext",
    },
    htmlContent: {
  type: "longtext", // or "text" depending on size
  nullable: true,
},
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
});
