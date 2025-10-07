import express, { Request, Response } from "express"
import cors from "cors"

const app = express();

app.use(cors({
    origin: ["http://localhost:3002", "http://localhostl3003"], credentials: true
}))

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now()
    })
})


const start = async () => {
    try {
        const PORT = 8000;
        app.listen(PORT, () => {
            console.log(`Product-Service is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Product-Service:", error);
        process.exit(1);
    }
}

start()
