import express from "express";
import morgan from "morgan";




export const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", healthRoutes);
app.use("/api/v1/productRoutes", productRoutes);