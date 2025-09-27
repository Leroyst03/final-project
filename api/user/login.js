const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const uri = process.env.MONGO_URI;
const secret = process.env.JWT_SECRET;
const dbName = process.env.DB_NAME;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Se requieren email y contraseña" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      await client.close();
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await client.close();
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
    await client.close();
    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error interno del servidor", details: err.message });
  }
};
