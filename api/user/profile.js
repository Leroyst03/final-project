const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
            // Buscar solo al usuario logueado
            const user = await db
                .collection("users")
                .findOne(
                { _id: new ObjectId(payload.id) },
                { projection: { password: 0 } } // ocultamos password
                );

            await client.close();

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            return res.status(200).json({ user });
        }

        if (req.method === "PUT") {
            const { name, age, password } = req.body;
            const updateData = {};
            if (name) updateData.name = name;
            if (age) updateData.age = age;
            if (password) updateData.password = await bcrypt.hash(password, 10);

            const result = await db
                .collection("users")
                .updateOne({ _id: new ObjectId(payload.id) }, { $set: updateData });

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
