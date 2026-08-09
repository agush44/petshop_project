// Uso: npm run make-admin -- email@ejemplo.com
// Promueve un usuario ya registrado a role: "admin".
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/mongo.js";
import { User } from "../models/user.js";

const email = process.argv[2];

if (!email) {
  console.error("Uso: npm run make-admin -- email@ejemplo.com");
  process.exit(1);
}

await connectDB();

const user = await User.findOneAndUpdate(
  { email: email.toLowerCase() },
  { role: "admin" },
  { returnDocument: "after" }
).select("-password");

if (!user) {
  console.error(`No se encontró ningún usuario con email "${email}". Registrate primero en /registro.`);
} else {
  console.log(`Listo: ${user.email} ahora es admin. Iniciá sesión de nuevo para que el token incluya el rol nuevo.`);
}

await mongoose.disconnect();
