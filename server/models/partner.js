import { EntitySchema } from "typeorm";

export const InsurancePartner = new EntitySchema({
  name: "InsurancePartner",
  tableName: "insurance_partner",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      length: 200,
      nullable: false,
    },
    slug: {
      type: "varchar",
      length: 45,
      nullable: false,
    },
    logo: {
      type: "varchar",
      length: 200,
      nullable: true,
    },
    payment_details_url: {
      type: "varchar",
      length: 500,
      nullable: true,
    },
    max_value: {
      type: "double",
      nullable: true,
    },
    partner_code: {
      type: "int",
      nullable: true,
    },
    status: {
      type: "tinyint",
      width: 1,
      nullable: false,
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
