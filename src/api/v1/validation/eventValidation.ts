import Joi from "joi";

export const createEventSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  date: Joi.string().isoDate().required(),
  capacity: Joi.number().integer().min(0).required()
});