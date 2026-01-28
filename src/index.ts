import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import express, { Request, Response } from "express";
import cors from "cors";
import * as groq from "./services/recommendationService";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db";

const PORT = process.env.PORT || 3000;

async function startServer() {
    await connectDB(); // 👈 CONEXIÓN AQUÍ

    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
}

startServer();

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
// Ruta principal (hecha async para await)
app.get("/", async (req: Request, res: Response) => {
    try {
        const result = await groq.main(
            "Quiero un coche por menos de 5000€ que me sirva para ir por el pueblo, tiene muchas cuestas y me acabo de sacar el carnet, vamos a por uno de segunda mano",
            "openai/gpt-oss-120b"  // Cambia a "llama3-8b-8192" si falla
        );
        res.json({ message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en Groq API", error: error.message });
    }
});

// GET all members
app.get("/api/members", async (req, res) => {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM members ORDER BY joined_date DESC"
    ).all();

    res.json({ success: true, members: results });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch members" });
  }
});

// GET a single member by ID
app.get("/api/members/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { results } = await env.DB.prepare(
      "SELECT * FROM members WHERE id = ?"
    )
      .bind(id)
      .all();

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found" });
    }

    res.json({ success: true, member: results[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch member" });
  }
});

// PUT - Update a member
app.put("/api/members/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Validate input
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        error: "At least one field (name or email) is required",
      });
    }

    // Basic email validation if provided (simplified for tutorial purposes)
    // For production, consider using a validation library or more comprehensive checks
    if (email && (!email.includes("@") || !email.includes("."))) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }

    values.push(id);

    const result = await env.DB.prepare(
      `UPDATE members SET ${updates.join(", ")} WHERE id = ?`
    )
      .bind(...values)
      .run();

    if (result.meta.changes === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found" });
    }

    res.json({ success: true, message: "Member updated successfully" });
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }
    res.status(500).json({ success: false, error: "Failed to update member" });
  }
});

// POST - Create a new member
app.post("/api/members", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    // Basic email validation (simplified for tutorial purposes)
    // For production, consider using a validation library or more comprehensive checks
    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    const joined_date = new Date().toISOString().split("T")[0];

    const result = await env.DB.prepare(
      "INSERT INTO members (name, email, joined_date) VALUES (?, ?, ?)"
    )
      .bind(name, email, joined_date)
      .run();

    if (result.success) {
      res.status(201).json({
        success: true,
        message: "Member created successfully",
        id: result.meta.last_row_id,
      });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Failed to create member" });
    }
  } catch (error: any) {
    // Handle unique constraint violation
    if (error.message?.includes("UNIQUE constraint failed")) {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }
    res.status(500).json({ success: false, error: "Failed to create member" });
  }
});

// DELETE - Delete a member
app.delete("/api/members/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await env.DB.prepare("DELETE FROM members WHERE id = ?")
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found" });
    }

    res.json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete member" });
  }
});

//app.listen(3000);
export default httpServerHandler({ port: 3000 });


