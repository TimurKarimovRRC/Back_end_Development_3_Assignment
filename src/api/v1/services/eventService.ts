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

import { getDocuments } from "../repositories/firestoreRepository";

export async function getAllEvents(): Promise<Event[]> {
  const querySnapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(eventsCollectionName);

  const events: Event[] = querySnapshot.docs.map((documentSnapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
    const documentData = documentSnapshot.data() as Omit<Event, "id">;

    return {
      id: documentSnapshot.id,
      ...(documentData as Omit<Event, "id">)
    };
  });

  return events;
}