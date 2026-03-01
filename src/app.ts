import express from "express";
import { healthRoutes } from "./api/v1/routes/healthRoutes";
import { eventRoutes } from "./api/v1/routes/eventRoutes";

export const app = express();

app.use(express.json());

app.use("/api/v1", healthRoutes);
app.use("/api/v1", eventRoutes);