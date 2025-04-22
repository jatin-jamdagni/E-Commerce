

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: string;


  constructor(message: string, statusCode: number, isOperational = true, details?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);

  }
}


// Not found error

export class NotFoundError extends AppError {
  constructor(message: "Resource not found") {
    super(message, 404,);
  }
}


// Validation error
export class ValidationError extends AppError {
  constructor(message?: string, details?: string) {
    super(message = "Invalid request data", 400, true, details);
  }
}

// Authentication error
export class AuthenticationError extends AppError {
  constructor(message: "Unauthorized access") {
    super(message, 401);
  }
}

// Forbidden error
export class ForbiddenError extends AppError {
  constructor(message: "Forbidden access") {
    super(message, 403);
  }
}

// Database error
export class DatabaseError extends AppError {
  constructor(message: "Database error", details?: string) {
    super(message, 500, false, details);
  }
}

// Rate limit error
export class RateLimitError extends AppError {
  constructor(message: "Too many requests") {
    super(message, 429);
  }
}




