import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import linkRouter from "./routes/links.route.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: "*",
        allowedHeaders: "*",
    })
);

// API routes
app.use(linkRouter);

// health check
app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// --------- SERVE FRONTEND BUILD ----------
// Vite uses /dist
const frontendDist = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(frontendDist));

// catch-all → send index.html for React Router
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
