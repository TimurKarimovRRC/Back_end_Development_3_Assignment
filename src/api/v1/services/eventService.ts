import { createDocument, deleteDocument, getDocumentById, getDocuments, updateDocument } from "../repositories/firestoreRepository";
import { DocumentSnapshot } from "firebase-admin/firestore";
import { CreateEventInput, Event, UpdateEventInput } from "../models/eventModel";

const eventsCollectionName: string = "events";

type NewEventRecord = Omit<Event, "id">;

export async function createEvent(createEventInput: CreateEventInput): Promise<Event> {
  const now: Date = new Date();

  const newEventRecord: NewEventRecord = {
    name: createEventInput.name,
    date: createEventInput.date,
    capacity: createEventInput.capacity,
    registrationCount: createEventInput.registrationCount ?? 0,
    status: createEventInput.status ?? "active",
    category: createEventInput.category ?? "general",
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
  const querySnapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(eventsCollectionName);

  const events: Event[] = querySnapshot.docs.map((documentSnapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
    const documentData: Omit<Event, "id"> = documentSnapshot.data() as Omit<Event, "id">;

    return {
      id: documentSnapshot.id,
      ...documentData
    };
  });

  return events;
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const documentSnapshot: DocumentSnapshot | null = await getDocumentById(eventsCollectionName, eventId);

  if (!documentSnapshot) {
    return null;
  }

  const documentData: Omit<Event, "id"> = documentSnapshot.data() as Omit<Event, "id">;

  return {
    id: documentSnapshot.id,
    ...documentData
  };
}

export async function updateEventById(eventId: string, updates: UpdateEventInput): Promise<Event | null> {
  const existingEvent: Event | null = await getEventById(eventId);
  if (!existingEvent) {
    return null;
  }

  const now: Date = new Date();

  const updatedRecord: NewEventRecord = {
    ...existingEvent,
    ...updates,
    id: undefined as never,
    updatedAt: now
  };

  const toUpdate: Partial<NewEventRecord> = {
    name: updatedRecord.name,
    date: updatedRecord.date,
    capacity: updatedRecord.capacity,
    registrationCount: updatedRecord.registrationCount,
    status: updatedRecord.status,
    category: updatedRecord.category,
    updatedAt: updatedRecord.updatedAt
  };

  await updateDocument<NewEventRecord>(eventsCollectionName, eventId, toUpdate);

  return {
    id: eventId,
    ...existingEvent,
    ...updates,
    updatedAt: now
  };
}

export async function deleteEventById(eventId: string): Promise<boolean> {
  const existingEvent: Event | null = await getEventById(eventId);
  if (!existingEvent) {
    return false;
  }

  await deleteDocument(eventsCollectionName, eventId);
  return true;
}