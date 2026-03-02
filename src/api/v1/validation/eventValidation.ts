import Joi from "joi";

const allowedStatuses = ["active", "cancelled", "completed"] as const;
const allowedCategories = ["conference", "workshop", "meetup", "seminar", "general"] as const;

function isFutureIsoDate(value: string): boolean {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;

  const now = new Date();
  return parsed.getTime() > now.getTime();
}

export const createEventSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().min(3).max(80).required().messages({
    "any.required": "name is required",
    "string.base": "name must be a string",
    "string.min": "name must be at least 3 characters long",
    "string.max": "name must be less than or equal to 80 characters long"
  }),

  date: Joi.string().isoDate().required().custom((value, helpers) => {
    if (!isFutureIsoDate(value)) {
      return helpers.error("date.future");
    }
    return value;
  }).messages({
    "any.required": "date is required",
    "string.isoDate": "date must be a valid ISO date",
    "date.future": "date must be in the future"
  }),

  capacity: Joi.number().integer().min(5).required().messages({
    "any.required": "capacity is required",
    "number.base": "capacity must be a number",
    "number.integer": "capacity must be an integer",
    "number.min": "capacity must be at least 5"
  }),

  registrationCount: Joi.number().integer().min(0).default(0).messages({
    "number.base": "registrationCount must be a number",
    "number.integer": "registrationCount must be an integer",
    "number.min": "registrationCount must be at least 0"
  }),

  status: Joi.string().valid(...allowedStatuses).default("active").messages({
    "any.only": "status must be one of: active, cancelled, completed"
  }),

  category: Joi.string().valid(...allowedCategories).default("general").messages({
    "any.only": "category must be one of: conference, workshop, meetup, seminar, general"
  })
}).custom((value, helpers) => {
  if (typeof value.registrationCount === "number" && typeof value.capacity === "number") {
    if (value.registrationCount > value.capacity) {
      return helpers.error("registrationCount.exceedsCapacity");
    }
  }
  return value;
}).messages({
  "registrationCount.exceedsCapacity": "registrationCount cannot exceed capacity"
});