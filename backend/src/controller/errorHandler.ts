import { Response } from "express";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../service/BaseService";

/** Central error handler used by all controllers */
export function handleError(err: unknown, res: Response): void {
  if (
    err instanceof ValidationError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError
  ) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "Internal server error" });
}
