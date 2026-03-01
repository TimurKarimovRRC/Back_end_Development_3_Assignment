import { Router } from "express";
import { createEventController } from "../controllers/eventController";
import { validateRequest } from "../middleware/validateRequest";
import { createEventSchema } from "../validation/eventValidation";

export const eventRoutes: Router = Router();

eventRoutes.post("/events", validateRequest(createEventSchema), createEventController);