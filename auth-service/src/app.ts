import express from "express";
import { connectToDB } from "./config/db";

const app = express();
app.use(express.json());

// Conexión a la base de datos
connectToDB();

// Rutas básicas
app.get("/health", (req, res) => {
	res.json({ status: "Auth Service is running" });
});

export default app;
