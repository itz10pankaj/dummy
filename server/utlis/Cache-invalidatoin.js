import { EventSubscriber } from "typeorm";
import { redisClient } from "../config/redis-client.js";

export const CacheInvalidationSubscriber = new EventSubscriber({
    listenTo() {
        return "*"; 
    },

    async afterInsert(event) {
        console.log(`Inserted in ${event.metadata.tableName}, clearing Redis cache...`);
        await redisClient.flushAll(); 
    },

    async afterUpdate(event) {
        console.log(`Updated in ${event.metadata.tableName}, clearing Redis cache...`);
        await redisClient.flushAll(); 
    },

    async afterRemove(event) {
        console.log(`Deleted from ${event.metadata.tableName}, clearing Redis cache...`);
        await redisClient.flushAll(); 
    },
});
