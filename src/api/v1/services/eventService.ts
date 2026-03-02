import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument
} from "../repositories/firestoreRepository";

import { CreateEventInput, Event, UpdateEventInput } from "../models/eventModel";
import { DocumentSnapshot } from "firebase-admin/firestore";

const eventsCollectionName: string = "events";

type NewEventRecord = Omit<Event, "id">;

function mapSnapshotToEvent(documentSnapshot: DocumentSnapshot): Event {
  const documentData: Omit<Event, "id"> = documentSnapshot.data() as Omit<Event, "id">;

  return {
    id: documentSnapshot.id,
    ...documentData
  };
}

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

  const events: Event[] = querySnapshot.docs.map(
    (documentSnapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
      const documentData: Omit<Event, "id"> = documentSnapshot.data() as Omit<Event, "id">;

      return {
        id: documentSnapshot.id,
        ...documentData
      };
    }
  );

  return events;
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const documentSnapshot: DocumentSnapshot | null = await getDocumentById(eventsCollectionName, eventId);

  if (!documentSnapshot) {
    return null;
  }

  return mapSnapshotToEvent(documentSnapshot);
}

export async function updateEventById(eventId: string, updates: UpdateEventInput): Promise<Event | null> {
  const existing: Event | null = await getEventById(eventId);

  if (!existing) {
    return null;
  }

  const now: Date = new Date();

  const updatePayload: Partial<NewEventRecord> = {
    ...updates,
    updatedAt: now
  };

  await updateDocument<NewEventRecord>(eventsCollectionName, eventId, updatePayload);


  const updatedEvent: Event = {
    ...existing,
    ...updates,
    updatedAt: now
  };

  return updatedEvent;
}

export async function deleteEventById(eventId: string): Promise<boolean> {
  const existing: Event | null = await getEventById(eventId);

  if (!existing) {
    return false;
  }

  await deleteDocument(eventsCollectionName, eventId);
  return true;
}