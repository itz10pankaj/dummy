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
import { CacheInvalidationSubscriber } from "../utlis/Cache-invalidatoin.js";
dotenv.config();
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,  
    database: process.env.DB_NAME,
    synchronize: true,  
    logging: true,
    entities: [User,Menu,Content,Course,Image,MetaTitle,Location,Category,Item,Photo,UserLogs,Template],
    subscribers: [CacheInvalidationSubscriber,ChangeLogger
    ],
});
