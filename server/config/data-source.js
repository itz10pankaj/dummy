import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { Menu } from "../models/Menu.js";
import { Course } from "../models/Courses.js";
import { Content } from "../models/Content.js";
import { Image } from "../models/Images.js";
import { MetaTitle } from "../models/MetaTitle.js";
import { Location } from "../models/Location.js";
import { Category } from "../models/Categories.js";
import { Item } from "../models/Items.js";
import { Photo } from "../models/Item_Photos.js";
import { UserLogs } from "../models/logs.js";
import { ChangeLogger } from "../dist/suscriber.js";
import { Template } from "../models/Template.js";
import { InsuranceBasicPremium } from "../models/Premium.js";
import { CacheInvalidationSubscriber } from "../utlis/Cache-invalidatoin.js";

import { InsurancePartner } from "../models/partner.js";
import { InsurancePartnerInsurerMapping } from "../models/partner_insuruer_mapping.js";
import { InsuranceInsurer } from "../models/Insurer.js";

dotenv.config();
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,  
    database: process.env.DB_NAME,
    synchronize: true,  
    logging: false,
    entities: [User,Menu,Content,Course,Image,MetaTitle,Location,Category,Item,Photo,UserLogs,Template,InsuranceBasicPremium,InsurancePartner,InsurancePartnerInsurerMapping,InsuranceInsurer],
    subscribers: [CacheInvalidationSubscriber,ChangeLogger],
    charset: "utf8mb4", 
    poolSize: 20,
    extra: {
        charset: "utf8mb4_unicode_ci",
        connectionLimit: 50,
        queueLimit: 100 
    }
});
