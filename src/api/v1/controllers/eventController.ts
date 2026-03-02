import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { CreateEventInput, Event } from "../models/eventModel";
import { createEvent } from "../services/eventService";
import { getAllEvents } from "../services/eventService";
import { getEventById } from "../services/eventService";
import { updateEventById } from "../services/eventService";
import { UpdateEventInput} from "../models/eventModel";
import { deleteEventById } from "../services/eventService";




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

export async function getAllEventsController(_request: Request, response: Response): Promise<void> {
  try {
    const eventList: Event[] = await getAllEvents();

    response.status(HTTP_STATUS.OK).json({
      count: eventList.length,
      events: eventList
    });
  } catch (_error: unknown) {
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch events"
    });
  }
}

export async function getEventByIdController(request: Request, response: Response): Promise<void> {
  try {
    const eventId: string = request.params.id;

    const event: Event | null = await getEventById(eventId);

    if (!event) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
      return;
    }

    response.status(HTTP_STATUS.OK).json(event);
  } catch (_error: unknown) {
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch event"
    });
  }
}


export async function updateEventController(request: Request, response: Response): Promise<void> {
  try {
    const eventId: string = request.params.id;
    const updates: UpdateEventInput = request.body as UpdateEventInput;

    const updatedEvent: Event | null = await updateEventById(eventId, updates);

    if (!updatedEvent) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
      return;
    }

    response.status(HTTP_STATUS.OK).json(updatedEvent);
  } catch (_error: unknown) {
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: "Failed to update event"
    });
  }
}

export async function deleteEventController(request: Request, response: Response): Promise<void> {
  try {
    const eventId: string = request.params.id;

    const isDeleted: boolean = await deleteEventById(eventId);

    if (!isDeleted) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ error: "Event not found" });
      return;
    }

    response.status(HTTP_STATUS.OK).json({ message: "Event deleted" });
  } catch (_error: unknown) {
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: "Failed to delete event"
    });
  }
}