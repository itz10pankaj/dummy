import { EntitySchema } from "typeorm";

export const InsuranceBasicPremium = new EntitySchema({
  name: "InsuranceBasicPremium",
  tableName: "insurance_basic_premium",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    vehicle_type_id: {
      type: "int",
      nullable: false,
    },
    insurance_type_id: {
      type: "int",
      nullable: false,
    },
    plate_area_type_id: {
      type: "int",
      nullable: false,
    },
    min_tsi: {
      type: "double",
      nullable: true,
    },
    max_tsi: {
      type: "double",
      nullable: true,
    },
    rate: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    status: {
      type: "int",
      default: 1,
      nullable: false,
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
        name: "vehicle_type_id",
        columns: ["vehicle_type_id"],
    },
    {
        name: "insurance_type_id",
        columns: ["insurance_type_id"],
    },
    {
        name: "plate_area_type_id",
        columns: ["plate_area_type_id"],
    },
],
});