import { Router } from "express";
import {
  createEventController,
  deleteEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController
} from "../controllers/eventController";
import { validateRequest } from "../middleware/validateRequest";
import { createEventSchema } from "../validation/eventValidation";

export const eventRoutes: Router = Router();

eventRoutes.get("/events", getAllEventsController);
eventRoutes.get("/events/:id", getEventByIdController);

eventRoutes.post("/events", validateRequest(createEventSchema), createEventController);

eventRoutes.put("/events/:id", updateEventController);
eventRoutes.delete("/events/:id", deleteEventController);