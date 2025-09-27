const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { name, age, email, password } = req.body;
  if (!name || !age || !email || !password) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      await client.close();
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, age, email, password: hashedPassword };
    await db.collection("users").insertOne(newUser);

    await client.close();
    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error interno del servidor", details: err.message });
  }
};
