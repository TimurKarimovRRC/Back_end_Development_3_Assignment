import { DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";
import { CreateEventInput, Event } from "../models/eventModel";
import { createDocument, getDocumentById, getDocuments } from "../repositories/firestoreRepository";
import { updateDocument } from "../repositories/firestoreRepository";
import { UpdateEventInput } from "../models/eventModel";
import { deleteDocument } from "../repositories/firestoreRepository";

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

export async function getAllEvents(): Promise<Event[]> {
  const querySnapshot: QuerySnapshot = await getDocuments(eventsCollectionName);

  const events: Event[] = querySnapshot.docs.map((documentSnapshot: QueryDocumentSnapshot) => {
    const documentData = documentSnapshot.data() as Omit<Event, "id">;

    return {
      id: documentSnapshot.id,
      ...(documentData as Omit<Event, "id">)
    };
  });

  return events;
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const documentSnapshot: DocumentSnapshot | null = await getDocumentById(eventsCollectionName, eventId);

  if (!documentSnapshot) {
    return null;
  }

  const documentData = documentSnapshot.data() as Omit<Event, "id">;

  return {
    id: documentSnapshot.id,
    ...(documentData as Omit<Event, "id">)
  };
}

export async function updateEventById(
  eventId: string,
  updateEventInput: UpdateEventInput
): Promise<Event | null> {
  const existingEvent: Event | null = await getEventById(eventId);

  if (!existingEvent) {
    return null;
  }

  const updatePayload: Partial<Omit<Event, "id">> = {
    ...updateEventInput,
    updatedAt: new Date()
  };

  await updateDocument<Omit<Event, "id">>(eventsCollectionName, eventId, updatePayload);

  const updatedEvent: Event | null = await getEventById(eventId);
  return updatedEvent;
}

export async function deleteEventById(eventId: string): Promise<boolean> {
  const existingEvent: Event | null = await getEventById(eventId);

  if (!existingEvent) {
    return false;
  }

  await deleteDocument(eventsCollectionName, eventId);

  return true;
}