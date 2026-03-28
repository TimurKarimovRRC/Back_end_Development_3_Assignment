import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const healthRoutes: Router = Router();

healthRoutes.get("/health", (_req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "v1"
  });
});