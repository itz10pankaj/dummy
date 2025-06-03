import { AppDataSource } from "../config/data-source.js";
import { Item } from "../models/Items.js"
import { Category } from "../models/Categories.js";
import { decryptID } from "../middleware/urlencrypt.js";
import { redisClient } from "../config/redis-client.js";
import { responseHandler } from "../utlis/responseHandler.js";
import { cpus } from 'os';
import fs from "fs"
import path from "path"
import csv from "csv-parser"
import { fileURLToPath } from "url";
import { Transform, PassThrough } from "stream";
import { pipeline } from "stream/promises";
const __filename = fileURLToPath(import.meta.url);
import { Worker } from 'worker_threads';


const getItemsByCategoryId = async (categoryId) => {
  return await AppDataSource.getRepository(Item).find({
    where: { category: { id: categoryId } },
    relations: ["category"],
  });
}

export const getItems = async (req, res) => {
  try {
    let { categoryId } = req.params;
    const decryptedCategoryId = decryptID(categoryId);
    console.log(decryptedCategoryId)
    if (!categoryId) {
      return responseHandler.badRequest(res, "Category ID is required", 400);
    }
    const cachedData = await redisClient.get(`Items:${decryptedCategoryId}`);
    if (cachedData) {
      console.log("Cache hit");
      return responseHandler.success(res, JSON.parse(cachedData), "Items fetched sucessfully", 200);
    }

    if (!decryptedCategoryId) {
      return responseHandler.badRequest(res, "Invalid Category ID", 400);
    }
    const items = await getItemsByCategoryId(decryptedCategoryId);
    await redisClient.setex(`Items:${decryptedCategoryId}`, 3600, JSON.stringify(items));
    return responseHandler.success(res, items, "Items fetched successfully", 200);
  } catch (err) {
    return responseHandler.error(res, err, "Server Error", 500);
  }
}


export const addItem = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const decryptedCategoryId = decryptID(categoryId);
    console.log("hitted")
    if (!decryptedCategoryId) {
      return responseHandler.badRequest(res, "Invalid Category ID", 400);
    }

    const { name, latitude, longitude } = req.body;

    if (!name) {
      return responseHandler.badRequest(res, "Item name is required", 400);
    }
    if (!latitude) {
      return responseHandler.badRequest(res, "Item latitude is required", 400);
    }
    if (!longitude) {
      return responseHandler.badRequest(res, "Item longitude is required", 400);
    }
    const categoryRepository = AppDataSource.getRepository(Category);
    const itemRepository = AppDataSource.getRepository(Item);

    const category = await categoryRepository.findOne({
      where: { id: decryptedCategoryId },
    });
    if (!category) {
      return responseHandler.badRequest(res, "Category not found", 404);
    }
    const existing = await itemRepository.findOne({
      where: {
        name: name,
        latitude: latitude,
        longitude: longitude,
        category: { id: category.id },
      },
      relations: ["category"],
    });

    // ✅ If item already exists
    if (existing) {
      return responseHandler.badRequest(res, "Item already exists", 409);
    }
    const newItem = itemRepository.create({
      name,
      latitude,
      longitude,
      category,
    });
    await itemRepository.save(newItem);
    const updatedItems = await itemRepository.find({
      where: { category: { id: decryptedCategoryId } },
      relations: ["category"],
    })
    await redisClient.setex(`Items:${decryptedCategoryId}`, 3600, JSON.stringify(updatedItems));
    return responseHandler.success(res, newItem, "Item added successfully", 201);

  }
  catch (err) {
    console.error("Error adding item:", err);
    return responseHandler.error(res, err, "Server Error", 500);
  }
}



export const bulkUploadItems = async (req, res) => {
  try {
    const startTime = Date.now();
    console.log(`Insertion started at: ${new Date(startTime).toLocaleString()}`);
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    if (!latitude || !longitude) {
      return responseHandler.badRequest(res, "Location is required", 400);
    }
    if (!req.file) {
      return responseHandler.badRequest(res, "CSV file not found", 400);
    }
    const itemsToInsert = [];
    const itemsAlreadyInserted = new Set(); // To track already inserted items
    let categoryIdFromCSV = null;
    const filePath = path.resolve(req.file.path);

    // Read CSV
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.name && row.categoryId) {
          categoryIdFromCSV = row.categoryId.trim();
          const itemKey = `${row.name.trim()}-${latitude}-${longitude}-${categoryIdFromCSV}`;

          // Check if the item is already in the list of itemsToInsert
          if (!itemsAlreadyInserted.has(itemKey)) {
            itemsAlreadyInserted.add(itemKey);
            itemsToInsert.push({
              name: row.name.trim(),
              latitude,
              longitude,
              categoryId: categoryIdFromCSV,
            });
          }
        }
      })
      .on("end", async () => {
        const categoryRepository = AppDataSource.getRepository(Category);
        const itemRepository = AppDataSource.getRepository(Item);

        const category = await categoryRepository.findOne({
          where: { id: categoryIdFromCSV },
        });

        if (!category) {
          return responseHandler.badRequest(res, "Category not found", 404);
        }

        const insertedItems = [];
        const duplicateItems = [];

        for (const item of itemsToInsert) {
          // Assign relation
          item.category = category;

          const existing = await itemRepository.findOne({
            where: {
              name: item.name,
              latitude: item.latitude,
              longitude: item.longitude,
              category: { id: category.id },
            },
            relations: ["category"],
          });

          if (existing) {
            duplicateItems.push({ ...item, status: "Duplicate" });
          } else {
            insertedItems.push(item);
          }
        }

        if (insertedItems.length > 0) {
          await itemRepository.save(insertedItems);

          const updatedItems = await itemRepository.find({
            where: { category: { id: category.id } },
            relations: ["category"],
          });

          await redisClient.setex(
            `Items:${category.id}`,
            3600,
            JSON.stringify(updatedItems)
          );
        }

        // Remove uploaded file
        fs.unlinkSync(filePath);

        // Combine inserted + duplicate with status
        const allResults = [
          ...insertedItems.map((i) => ({ ...i, status: "Inserted" })),
          ...duplicateItems,
        ];

        // CSV output
        const csvString = [
          ["name", "latitude", "longitude", "status"],
          ...allResults.map((item) => [
            item.name,
            item.latitude,
            item.longitude,
            item.status,
          ]),
        ]
          .map((row) => row.join(","))
          .join("\n");

        // Send as downloadable CSV
        const endTime = Date.now();
        const timeTaken = endTime - startTime;  // in milliseconds
        console.log(`Insertion completed at: ${new Date(endTime).toLocaleString()}`);
        console.log(`Total time taken for insertion: ${timeTaken} milliseconds`);
        res.setHeader("Content-disposition", `attachment; filename=result.csv`);
        res.setHeader("Content-Type", "text/csv");
        res.status(201).send(csvString);
      });
  } catch (err) {
    console.error("bulk error", err);
    return responseHandler.error(res, err, "Server Error", 500);
  }
};

export const bulkUploadItemsUsingWorker = async (req, res) => {
  try {
    const rowsStatus = [];
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    if (!latitude || !longitude) return responseHandler.badRequest(res, "Location is required", 400);
    if (!req.file) return responseHandler.badRequest(res, "CSV file not found", 400);

    const filePath = path.resolve(req.file.path);
    const startTime = Date.now();

    const CPU_CORES = Math.max(4, cpus().length - 1);
    const TOTAL_WORKERS = Math.min(CPU_CORES, 3);
    const workerPool = [];

    for (let i = 0; i < TOTAL_WORKERS; i++) {
      const worker = new Worker(path.join(path.dirname(__filename), '../utlis/worker.js'));
      workerPool.push(worker);
    }

    let currentWorkerIndex = 0;

    const categoryRepository = AppDataSource.getRepository(Category);
    const categoriesCache = new Map();

    const handleWorkerMessage = async (message) => {
      if (message.type === 'batch') {
        const newItems = [];

        for (const { name, latitude, longitude, categoryId } of message.data) {
          let category = categoriesCache.get(categoryId);
          if (!category) {
            category = await categoryRepository.findOne({ where: { id: categoryId } });
            if (category) categoriesCache.set(categoryId, category);
          }

          if (!category) {
            rowsStatus.push({ name, latitude, longitude, status: "Category Not Found" });
            continue;
          }

          newItems.push({ name, latitude, longitude, category });
          // console.log("rowStatus Push hoga")
          rowsStatus.push({ name, latitude, longitude, status: "Inserted" });
          // console.log("rowStatus Push hoga gya",rowsStatus)
        }

        if (newItems.length > 0) {
          const values = newItems.map(item =>
            `('${item.name.replace(/'/g, "''")}', ${item.latitude}, ${item.longitude}, '${item.category.id}')`
          ).join(',');

          const sql = `
            INSERT INTO ins_items (name, latitude, longitude, categoryId)
            VALUES ${values}
          `;
          AppDataSource.query(sql);
        }
      }
    };

    const workerResults = workerPool.map((worker) => {
      let pendingPromises = [];
      return new Promise((resolve, reject) => {
        worker.on('message', async (message) => {
          if (message.type === 'batch') {
            const promise = handleWorkerMessage(message);
            pendingPromises.push(promise);
            promise.finally(() => {
              // remove resolved promise
              pendingPromises = pendingPromises.filter(p => p !== promise);
            });
          }
          else if (message.type === 'done') {
            Promise.all(pendingPromises).then(resolve).catch(reject);
          }
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
        });
      });
    });

    const distributor = new Transform({
      objectMode: true,
      transform(row, encoding, callback) {
        const worker = workerPool[currentWorkerIndex];
        worker.postMessage({ type: 'row', row, latitude, longitude });
        currentWorkerIndex = (currentWorkerIndex + 1) % TOTAL_WORKERS;
        callback();
      }
    });

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .pipe(distributor)
        .on('finish', () => {
          for (const worker of workerPool) {
            worker.postMessage({ type: 'complete' });
          }
          resolve();
        })
        .on('error', reject);
    });

    await Promise.all(workerResults);

    const csvString = [
      ["name", "latitude", "longitude", "status"],
      ...rowsStatus.map(row => [row.name, row.latitude, row.longitude, row.status])
    ].map(row => row.join(",")).join("\n");

    const endTime = Date.now();
    console.log(`Insertion completed in ${(endTime - startTime) / 1000} seconds`);
    res.setHeader("Content-disposition", "attachment; filename=result.csv");
    res.setHeader("Content-Type", "text/csv");
    res.status(201).send(csvString);

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Bulk upload error:", err);
    return responseHandler.error(res, err, "Server Error", 500);
  }
};




export const UploadText = async (req, res) => {
  try {
    if (!req.file) {
      return responseHandler.badRequest(res, "TXT file not found", 400);
    }

    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    const filePath = path.resolve(req.file.path);

    const readStream = fs.createReadStream(filePath, {
      encoding: 'utf-8',
      highWaterMark: 64 * 1024       // ye chich read Stream mai chunk size ko controll kregi
    });

    res.setHeader("Content-disposition", "attachment; filename=modified.txt");
    res.setHeader("Content-Type", "text/plain");

    let leftover = '';
    let buffer = [];
    const FLUSH_THRESHOLD = 1000;

    readStream.on('data', (chunk) => {
      const data = leftover + chunk;
      let lineStart = 0;

      for (let i = 0; i < data.length; i++) {
        if (data[i] === '\n') {
          const line = data.slice(lineStart, i);
          if (line.length > 0) { 
            buffer.push(line.charAt(0).toUpperCase() + line.slice(1));
          }

          if (buffer.length >= FLUSH_THRESHOLD) {
            res.write(buffer.join('\n') + '\n'); 
            buffer = [];
          }

          lineStart = i + 1;
        }
      }

      leftover = data.slice(lineStart);
    });

    readStream.on('end', () => {
      // Process remaining leftover
      if (leftover.length > 0) {
        buffer.push(leftover.charAt(0).toUpperCase() + leftover.slice(1));
      }

      // Write remaining buffer
      if (buffer.length > 0) {
        res.write(buffer.join('\n') + '\n');
      }

      res.end();

      // Clean up file
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    });

    readStream.on('error', (err) => {
      console.error('Error reading input file:', err);
      res.status(500).send('Error processing file');
    });

    res.on('finish', () => {
      const endTime = Date.now();
      const endMemory = process.memoryUsage();

      console.log(`Processing completed in ${(endTime - startTime) / 1000}s`);
      console.log(`Memory usage: ${(endMemory.heapUsed - startMemory.heapUsed) / 1024 } KB`);
    });

  } catch (err) {
    console.error("Bulk text processing error:", err);
    return responseHandler.error(res, err, "Server Error", 500);
  }
};





