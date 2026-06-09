import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser())
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Successfully connected to Quill Ai server" });
});

//Auth Routes
app.use("/api/auth", authRouter)

//Chat Routes
app.use("/api/chat", chatRouter)

app.get(/.*/, (req, res, next) => {
    if (req.url.startsWith("/api")) {
        return next();
    }
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;