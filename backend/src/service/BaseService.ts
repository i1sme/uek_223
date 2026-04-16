import { UserRole } from "../entity/User";

/** Error thrown when a user tries to modify content they don't own */
export class ForbiddenError extends Error {
  public readonly statusCode = 403;

  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Error thrown when a requested resource does not exist */
export class NotFoundError extends Error {
  public readonly statusCode = 404;

  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

/** Error thrown for invalid input data */
export class ValidationError extends Error {
  public readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Base class for all services.
 * Provides shared authorization helpers and error types.
 */
export abstract class BaseService {
  /**
   * Checks whether the requester is allowed to modify a resource.
   * Moderators and admins can edit any content; users only their own.
   */
  protected checkOwnershipOrElevatedRole(
    resourceAuthorId: string,
    requesterId: string,
    requesterRole: UserRole
  ): void {
    const isOwner = resourceAuthorId === requesterId;
    const hasElevatedRole =
      requesterRole === "moderator" || requesterRole === "admin";

    if (!isOwner && !hasElevatedRole) {
      throw new ForbiddenError(
        "You do not have permission to modify this resource"
      );
    }
  }
}
