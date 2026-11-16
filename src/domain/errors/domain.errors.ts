export abstract class DomainError extends Error {
  public abstract readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    if (details !== undefined) {
      this.details = details;
    }
  }
}

export class ValidationError extends DomainError {
  public readonly code = "VALIDATION_ERROR";
}

export class NotFoundError extends DomainError {
  public readonly code = "RESOURCE_NOT_FOUND";
}

export class ConflictError extends DomainError {
  public readonly code = "RESOURCE_CONFLICT";
}

export class UnauthorizedError extends DomainError {
  public readonly code = "UNAUTHORIZED";
}

export class ForbiddenError extends DomainError {
  public readonly code = "FORBIDDEN";
}

export class TenantIsolationError extends DomainError {
  public readonly code = "TENANT_ISOLATION_VIOLATION";
}
