import { createEvent, getAllEvents, getEventById, updateEventById, deleteEventById } from "../src/api/v1/services/eventService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";


jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("eventService", () => {
  it("it should call createDocument when creating an event", async () => {
    // Arrange
    const mockedCreateDocument = firestoreRepository.createDocument as unknown as jest.Mock;
    mockedCreateDocument.mockResolvedValue("event-123");

    const createInput = {
      name: "Tech Conference",
      date: "2025-03-15T09:00:00.000Z",
      capacity: 200
    };

    // Act
    const result = await createEvent(createInput);

    // Assert
    expect(mockedCreateDocument).toHaveBeenCalledTimes(1);
    expect(result.id).toBe("event-123");
    expect(result.name).toBe("Tech Conference");
    expect(result.capacity).toBe(200);
  });

  it("it should return all events from firestore query snapshot", async () => {
    // Arrange
    const mockedGetDocuments = firestoreRepository.getDocuments as unknown as jest.Mock;

    const fakeDocs = [
      {
        id: "event-1",
        data: () => ({
          name: "Event One",
          date: "2025-03-15T09:00:00.000Z",
          capacity: 100,
          registrationCount: 0,
          createdAt: new Date("2025-03-01T00:00:00.000Z"),
          updatedAt: new Date("2025-03-01T00:00:00.000Z")
        })
      },
      {
        id: "event-2",
        data: () => ({
          name: "Event Two",
          date: "2025-04-10T18:00:00.000Z",
          capacity: 50,
          registrationCount: 5,
          createdAt: new Date("2025-03-02T00:00:00.000Z"),
          updatedAt: new Date("2025-03-02T00:00:00.000Z")
        })
      }
    ];

    mockedGetDocuments.mockResolvedValue({ docs: fakeDocs });

    // Act
    const result = await getAllEvents();

    // Assert
    expect(mockedGetDocuments).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("event-1");
    expect(result[0].name).toBe("Event One");
    expect(result[1].id).toBe("event-2");
    expect(result[1].capacity).toBe(50);
  });
  it("it should return null when event does not exist", async () => {
  // Arrange
  const mockedGetDocumentById = firestoreRepository.getDocumentById as unknown as jest.Mock;
  mockedGetDocumentById.mockResolvedValue(null);

  // Act
  const result = await getEventById("missing id");

  // Assert
  expect(mockedGetDocumentById).toHaveBeenCalledTimes(1);
  expect(result).toBeNull();
});

it("it should update an event and return the updated result", async () => {
  // Arrange
  const mockedGetDocumentById = firestoreRepository.getDocumentById as unknown as jest.Mock;
  const mockedUpdateDocument = firestoreRepository.updateDocument as unknown as jest.Mock;

  const existingSnapshot = {
    id: "event-1",
    data: () => ({
      name: "Old Name",
      date: "2025-03-15T09:00:00.000Z",
      capacity: 100,
      registrationCount: 0,
      createdAt: new Date("2025-03-01T00:00:00.000Z"),
      updatedAt: new Date("2025-03-01T00:00:00.000Z")
    })
  };

  const updatedSnapshot = {
    id: "event-1",
    data: () => ({
      name: "New Name",
      date: "2025-03-15T09:00:00.000Z",
      capacity: 100,
      registrationCount: 0,
      createdAt: new Date("2025-03-01T00:00:00.000Z"),
      updatedAt: new Date("2025-03-02T00:00:00.000Z")
    })
  };

  mockedGetDocumentById
    .mockResolvedValueOnce(existingSnapshot) // first read
    .mockResolvedValueOnce(updatedSnapshot); // read after update

  mockedUpdateDocument.mockResolvedValue(undefined);

  // Act
  const result = await updateEventById("event-1", { name: "New Name" });

  // Assert
  expect(mockedUpdateDocument).toHaveBeenCalledTimes(1);
  expect(mockedGetDocumentById).toHaveBeenCalledTimes(2);
  expect(result).not.toBeNull();
  expect(result?.id).toBe("event-1");
  expect(result?.name).toBe("New Name");
});

it("it should delete an event and return true when event exists", async () => {
  // Arrange
  const mockedGetDocumentById = firestoreRepository.getDocumentById as unknown as jest.Mock;
  const mockedDeleteDocument = firestoreRepository.deleteDocument as unknown as jest.Mock;

  const existingSnapshot = {
    id: "event-1",
    data: () => ({
      name: "Event One",
      date: "2025-03-15T09:00:00.000Z",
      capacity: 100,
      registrationCount: 0,
      createdAt: new Date("2025-03-01T00:00:00.000Z"),
      updatedAt: new Date("2025-03-01T00:00:00.000Z")
    })
  };

  mockedGetDocumentById.mockResolvedValue(existingSnapshot);
  mockedDeleteDocument.mockResolvedValue(undefined);

  // Act
  const result = await deleteEventById("event-1");

  // Assert
  expect(mockedGetDocumentById).toHaveBeenCalledTimes(1);
  expect(mockedDeleteDocument).toHaveBeenCalledTimes(1);
  expect(result).toBe(true);
});
});