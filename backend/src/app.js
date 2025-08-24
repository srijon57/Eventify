import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); 

            if (
                allowedOrigins.includes(origin) || 
                /\.vercel\.app$/.test(origin) 
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ROUTERS
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/event.route.js";
import certificateRoutes from "./routes/certificate.route.js";
import analyticsRouter from "./routes/analytics.route.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/analytics", analyticsRouter);

export { app };
