import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export function validateRequest(schema: Joi.ObjectSchema) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const validationResult: Joi.ValidationResult = schema.validate(request.body, {
      abortEarly: true,
      stripUnknown: true
    });

    if (validationResult.error) {
      response.status(HTTP_STATUS.BAD_REQUEST).json({
        error: validationResult.error.details[0].message
      });
      return;
    }

    request.body = validationResult.value;
    next();
  };
}