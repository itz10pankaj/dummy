var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EventSubscriber } from "typeorm";
import { connectToMongo, getMongoDb } from "../config/mogodb.js";
let ChangeLogger = class ChangeLogger {
    constructor() {
        connectToMongo(); // Ensure MongoDB connection is established
    }
    /**
     * Listen to INSERT events
     */
    async afterInsert(event) {
        // console.log("✅ INSERT event triggered for table:", event.metadata.tableName);
        await this.logChange("INSERT", {
            entity: event.entity,
            databaseEntity: null,
            metadata: { tableName: event.metadata.tableName },
        });
    }
    /**
     * Listen to UPDATE events
     */
    async afterUpdate(event) {
        // console.log("✅ UPDATE event triggered for table:", event.metadata.tableName);
        await this.logChange("UPDATE", event);
    }
    /**
     * Listen to DELETE events
     */
    async afterRemove(event) {
        // console.log("✅ DELETE event triggered for table:", event.metadata.tableName);
        await this.logChange("DELETE", event);
    }
    /**
     * Log the change into MongoDB
     */
    async logChange(operation, event) {
        const db = getMongoDb();
        const collection = db.collection("change_logs");
        const oldData = operation === "UPDATE" || operation === "DELETE"
            ? event.databaseEntity
            : null;
        const newData = operation === "INSERT" || operation === "UPDATE"
            ? event.entity
            : null;
        const logEntry = {
            tableName: event.metadata.tableName,
            operation,
            oldData,
            newData,
            timestamp: new Date(),
        };
        await collection.insertOne(logEntry);
        // console.log(`📌 Change logged in MongoDB: ${operation} on ${event.metadata.tableName}`);
    }
};
ChangeLogger = __decorate([
    EventSubscriber(),
    __metadata("design:paramtypes", [])
], ChangeLogger);
export { ChangeLogger };
