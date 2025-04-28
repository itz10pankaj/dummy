import { EntitySchema } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

// const tableName = process.env.TABLE_TEMPLATES || "templates";

export const Template = new EntitySchema({
  name: "Template",
  tableName: "ins_templates",
  charset: "utf8mb4",
  collation: "utf8mb4_unicode_ci",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fileName: {
      type: "varchar",
      charset: "utf8mb4", // Explicitly set for this column
      collation: "utf8mb4_unicode_ci",
    },
    content: {
      type: "longtext",
      charset: "utf8mb4", // Explicitly set for this column
      collation: "utf8mb4_unicode_ci",
    },
    htmlContent: {
  type: "longtext",
  charset: "utf8mb4", // Explicitly set for this column
      collation: "utf8mb4_unicode_ci", // or "text" depending on size
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
