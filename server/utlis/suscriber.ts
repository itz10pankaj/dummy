import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from "typeorm";
import  {connectToMongo, getMongoDb}  from "../config/mogodb";

@EventSubscriber()
export class ChangeLogger implements EntitySubscriberInterface {
    // constructor() {
    //     connectToMongo(); // Ensure MongoDB connection is established
    // }

    /**
     * Listen to INSERT events
     */
    async afterInsert(event: InsertEvent<any>) {
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
    async afterUpdate(event: { entity: any; databaseEntity: any; metadata: { tableName: any; }; }) {
        // console.log("✅ UPDATE event triggered for table:", event.metadata.tableName);
        await this.logChange("UPDATE", event);
    }

    /**
     * Listen to DELETE events
     */
    async afterRemove(event: RemoveEvent<any>) {
        // console.log("✅ DELETE event triggered for table:", event.metadata.tableName);
        await this.logChange("DELETE", event);
    }

    /**
     * Log the change into MongoDB
     */
async logChange(operation: string, event: {
        entity?: any;
        databaseEntity: any; metadata: { tableName: any; }; 
}) {
            const db = await connectToMongo();
        // const db = getMongoDb();
        const collection = db.collection("change_logs");

        const oldData =
            operation === "UPDATE" || operation === "DELETE"
                ? event.databaseEntity
                : null;

        const newData =
            operation === "INSERT" || operation === "UPDATE"
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
        console.log(`📌 Change logged in MongoDB: ${operation} on ${event.metadata.tableName}`);
    }
}