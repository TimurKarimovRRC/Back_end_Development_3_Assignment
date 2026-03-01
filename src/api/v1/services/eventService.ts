import { createDocument } from "../repositories/firestoreRepository";
import { CreateEventInput, Event } from "../models/eventModel";

const eventsCollectionName: string = "events";

type NewEventRecord = Omit<Event, "id">;

export async function createEvent(createEventInput: CreateEventInput): Promise<Event> {
  const now: Date = new Date();

  const newEventRecord: NewEventRecord = {
    name: createEventInput.name,
    date: createEventInput.date,
    capacity: createEventInput.capacity,
    registrationCount: 0,
    createdAt: now,
    updatedAt: now
  };

  const createdEventId: string = await createDocument<NewEventRecord>(
    eventsCollectionName,
    newEventRecord
  );

  return {
    id: createdEventId,
    ...newEventRecord
  };
}