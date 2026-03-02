import { createEvent } from "../src/api/v1/services/eventService";
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
});