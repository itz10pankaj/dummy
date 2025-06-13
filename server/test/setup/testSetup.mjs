
import { initializeServer } from "../../server.js";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await initializeServer(); 
});

