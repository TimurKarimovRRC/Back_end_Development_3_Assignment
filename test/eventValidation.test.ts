import { createEventSchema } from "../src/api/v1/validation/eventValidation";

function getFutureIsoDate(daysAhead: number = 1): string {
  return new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString();
}

describe("createEventSchema", () => {
  it("it should pass validation for valid event data", () => {
    // Arrange
    const validEvent = {
      name: "Tech Conference",
      date: getFutureIsoDate(10),
      capacity: 200
    };

    // Act
    const result = createEventSchema.validate(validEvent);

    // Assert
    expect(result.error).toBeUndefined();
  });

  it("it should fail validation when name is missing", () => {
    // Arrange
    const invalidEvent = {
      date: getFutureIsoDate(10),
      capacity: 200
    };

    // Act
    const result = createEventSchema.validate(invalidEvent);

    // Assert
    expect(result.error).toBeDefined();
  });

  it("it should fail validation when date is not ISO format", () => {
    // Arrange
    const invalidEvent = {
      name: "Tech Conference",
      date: "03/15/2025",
      capacity: 200
    };

    // Act
    const result = createEventSchema.validate(invalidEvent);

    // Assert
    expect(result.error).toBeDefined();
  });

  it("it should fail validation when date is in the past", () => {
    // Arrange
    const invalidEvent = {
      name: "Tech Conference",
      date: "2025-03-15T09:00:00.000Z",
      capacity: 200
    };

    // Act
    const result = createEventSchema.validate(invalidEvent);

    // Assert
    expect(result.error).toBeDefined();
  });

  it("it should fail validation when capacity is negative", () => {
    // Arrange
    const invalidEvent = {
      name: "Tech Conference",
      date: getFutureIsoDate(10),
      capacity: -1
    };

    // Act
    const result = createEventSchema.validate(invalidEvent);

    // Assert
    expect(result.error).toBeDefined();
  });
});