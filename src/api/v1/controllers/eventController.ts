import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export function createEventController(_request: Request, response: Response): void {
  response.status(HTTP_STATUS.CREATED).json({
    message: "just for test"
  });
}