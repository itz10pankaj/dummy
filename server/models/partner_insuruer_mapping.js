import { EntitySchema } from "typeorm";

export const InsurancePartnerInsurerMapping = new EntitySchema({
  name: "InsurancePartnerInsurerMapping",
  tableName: "insurance_partner_insurer_mapping",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    partner_id: {
      type: "int",
      nullable: false,
    },
    insurer_id: {
      type: "int",
      nullable: false,
    },
    admin_fee: {
      type: "int",
      nullable: false,
    },
    status: {
      type: "tinyint",
      width: 1,
      nullable: false,
      default: 1,
    },
    created_at: {
      type: "timestamp",
      nullable: true,
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      nullable: true,
      updateDate: true,
    },
  },
});
