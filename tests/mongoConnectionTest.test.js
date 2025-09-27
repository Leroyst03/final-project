require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

describe("Conexión a MongoDB", () => {
  let client;

  beforeAll(async () => {
    client = new MongoClient(uri);
    await client.connect();
  });

  afterAll(async () => {
    if (client) await client.close();
  });

  test("Se establece conexión con el cluster", async () => {
    const admin = client.db(dbName).admin();
    const result = await admin.ping();
    expect(result.ok).toBe(1);
  });
});
