const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

const uri = process.env.MONGO_URI;
const secret = process.env.JWT_SECRET;
const dbName = process.env.DB_NAME;

module.exports = async function handler(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = auth.split(" ")[1];
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    if (req.method === "GET") {
      const usuarios = await db
        .collection("users")
        .find()
        .project({ password: 0 }) // ocultamos password
        .toArray();
      await client.close();
      return res.status(200).json({ usuarios });
    }

    if (req.method === "PUT") {
      const { name, age, password } = req.body;
      const updateData = {};
      if (name) updateData.name = name;
      if (age) updateData.age = age;
      if (password) updateData.password = await bcrypt.hash(password, 10);

      const result = await db
        .collection("users")
        .updateOne({ _id: payload.id }, { $set: updateData });

      await client.close();
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      return res
        .status(200)
        .json({ message: "Perfil actualizado correctamente" });
    }

    await client.close();
    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error interno del servidor", details: err.message });
  }
};
