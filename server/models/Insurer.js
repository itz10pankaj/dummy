import { EntitySchema } from "typeorm";

export const InsuranceInsurer = new EntitySchema({
  name: "InsuranceInsurer",
  tableName: "insurance_insurer",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    commision_to_oto: {
      type: "double",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    logo: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    status: {
      type: "tinyint",
      nullable: false,
      default: 1,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
  indices: [
    {
      name: "name",
      columns: ["name"],
    },
    {
      name: "status",
      columns: ["status"],
    },
  ],
});
