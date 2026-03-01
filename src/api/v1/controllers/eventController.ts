import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { CreateEventInput, Event } from "../models/eventModel";
import { createEvent } from "../services/eventService";

export async function createEventController(request: Request, response: Response): Promise<void> {
  try {
    const createEventInput: CreateEventInput = request.body as CreateEventInput;

    const createdEvent: Event = await createEvent(createEventInput);

    response.status(HTTP_STATUS.CREATED).json(createdEvent);
  } catch (_error: unknown) {
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: "Failed to create event"
    });
  }
}