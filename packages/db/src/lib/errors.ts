// Error types tailored for stellar-stocks
export type ErrorType =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limit"
  | "offline"
  | "conflict"
  | "validation"
  | "internal";

// App-specific error surfaces
export type Surface =
  | "api"
  | "auth"
  | "database"
  | "kyc"
  | "order"
  | "user"
  | "wallet"
  | "migration"
  | "stock"
  | "system";

export type ErrorCode = `${ErrorType}:${Surface}`;
export type ErrorVisibility = "response" | "log" | "none";

export const visibilityBySurface: Record<Surface, ErrorVisibility> = {
  api: "response",
  auth: "response",
  database: "log",
  kyc: "response",
  order: "response",
  user: "response",
  wallet: "response",
  migration: "log",
  stock: "response",
  system: "log",
};

export class AppError extends Error {
  public type: ErrorType;
  public surface: Surface;
  public statusCode: number;
  public cause?: string;

  constructor(errorCode: ErrorCode, cause?: string) {
    super();
    const [type, surface] = errorCode.split(":");
    this.type = type as ErrorType;
    this.surface = surface as Surface;
    this.cause = cause;
    this.message = getMessageByErrorCode(errorCode);
    this.statusCode = getStatusCodeByType(this.type);
  }

  public toResponse() {
    const code: ErrorCode = `${this.type}:${this.surface}`;
    const visibility = visibilityBySurface[this.surface];
    const { message, cause, statusCode } = this;
    if (visibility === "log") {
      // Log full error for internal surfaces
      console.error({ code, message, cause });
      return Response.json(
        { code: "internal:system", message: "Internal server error." },
        { status: statusCode },
      );
    }
    return Response.json({ code, message, cause }, { status: statusCode });
  }
}

export function getMessageByErrorCode(errorCode: ErrorCode): string {
  // Custom messages for stellar-stocks
  if (errorCode.includes("database")) {
    return "A database error occurred. Please try again later.";
  }
  if (errorCode.includes("kyc")) {
    return "KYC verification failed or is required.";
  }
  if (errorCode.includes("order")) {
    return "Order processing error. Please check your order details.";
  }
  if (errorCode.includes("wallet")) {
    return "Wallet error. Please reconnect or try a different wallet.";
  }
  if (errorCode.includes("migration")) {
    return "A migration error occurred. Please contact support.";
  }
  switch (errorCode) {
    case "bad_request:api":
      return "Invalid request. Please check your input.";
    case "unauthorized:auth":
      return "Authentication required. Please sign in.";
    case "forbidden:user":
      return "You do not have permission to perform this action.";
    case "not_found:stock":
      return "Requested stock not found.";
    case "conflict:user":
      return "A user with this information already exists.";
    case "validation:order":
      return "Order validation failed. Please check your input.";
    case "rate_limit:api":
      return "Too many requests. Please slow down.";
    case "offline:system":
      return "The system is currently offline. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

function getStatusCodeByType(type: ErrorType) {
  switch (type) {
    case "bad_request":
    case "validation":
      return 400;
    case "unauthorized":
      return 401;
    case "forbidden":
      return 403;
    case "not_found":
      return 404;
    case "conflict":
      return 409;
    case "rate_limit":
      return 429;
    case "offline":
      return 503;
    case "internal":
      return 500;
    default:
      return 500;
  }
}
