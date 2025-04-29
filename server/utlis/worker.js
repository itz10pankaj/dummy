import { parentPort } from 'worker_threads';
import { AppDataSource } from '../config/data-source.js';
import { Item } from '../models/Items.js';
import { Category } from '../models/Categories.js';
import { redisClient } from '../config/redis-client.js';
import { connectToMongo } from "../config/mogodb.js";

await connectToMongo();
await AppDataSource.initialize();

const itemRepository = AppDataSource.getRepository(Item);
const categoryRepository = AppDataSource.getRepository(Category);

const BATCH_SIZE = 500;
let buffer = [];
let categoriesCache = new Map();

parentPort.on('message', async (message) => {
  try {
    if (message.type === 'row') {
      const { row, latitude, longitude } = message;
      const name = row.name.trim();
      const categoryId = row.categoryId.trim();

      buffer.push({ name, latitude, longitude, categoryId });

      if (buffer.length >= BATCH_SIZE) {
        await processBuffer();
      }
    } else if (message.type === 'complete') {
      if (buffer.length > 0) {
        await processBuffer();
      }
      parentPort.postMessage({ type: 'done' });
    }
  } catch (error) {
    console.error("Worker error:", error);
    parentPort.postMessage({ type: 'error', error: error.message });
    process.exit(1);
  }
});

async function processBuffer() {
  const newItems = [];
  const rowsStatus = [];

  for (const { name, latitude, longitude, categoryId } of buffer) {

    let category = categoriesCache.get(categoryId);
    if (!category) {
      category = await categoryRepository.findOne({ where: { id: categoryId } });
      if (category) {
        categoriesCache.set(categoryId, category);
      }
    }

    if (!category) {
      rowsStatus.push({ name, latitude, longitude, status: "Category Not Found" });
      continue;
    }

    newItems.push({ name, latitude, longitude, category });
    rowsStatus.push({ name, latitude, longitude, status: "Inserted" });
  }


  // if (newItems.length > 0) {
  //   await itemRepository.insert(newItems);
  // }
  if (newItems.length > 0) {
    const values = newItems.map(item =>
      `('${item.name.replace(/'/g, "''")}', ${item.latitude}, ${item.longitude}, '${item.category.id}')`
    ).join(',');
  
    const sql = `
      INSERT INTO ins_items (name, latitude, longitude, categoryId)
      VALUES ${values}
    `;
  
    await AppDataSource.query(sql);
  }
  

  // if (categoriesCache.size > 0) {
  //   for (const [catId, category] of categoriesCache.entries()) {
  //     const updatedItems = await itemRepository.find({
  //       where: { category: { id: catId } },
  //       relations: ["category"],
  //     });
  //     await redisClient.setex(`Items:${catId}`, 3600, JSON.stringify(updatedItems));
  //   }
  // }
  for (const r of rowsStatus) {
    parentPort.postMessage({ type: 'rowResult', data: r });
  }

  buffer = [];
}
