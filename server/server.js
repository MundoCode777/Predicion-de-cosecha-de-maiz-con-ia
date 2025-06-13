import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  email: String,
  password: String, // ⚠️ En producción usa bcrypt
});
const User = mongoose.model("User", userSchema);

// Registro
app.post("/api/registrar", async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "El correo ya está registrado." });
  }

  const user = new User({ email, password });
  await user.save();
  res.json({ message: "Usuario registrado correctamente." });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Credenciales incorrectas." });
  }

  res.json({ message: "Inicio de sesión exitoso." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
