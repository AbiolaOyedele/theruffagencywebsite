/** Application error type and the shape every failed request answers with. */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    /** Plain English. This is shown to the person who hit the error. */
    public override message: string,
    /** DOMAIN_ACTION_REASON. */
    public code: string,
    /** Internal only — never serialised to the client. */
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/** Field name → message, for the client to render inline. */
export type FieldErrors = Readonly<Record<string, string>>;

export interface ErrorBody {
  readonly error: { readonly code: string; readonly message: string };
  readonly fieldErrors?: FieldErrors;
}

/**
 * Converts anything thrown into a response.
 *
 * Only `AppError` reaches the client with its own message — those we wrote.
 * Everything else is logged and answered with a generic 500, so an internal
 * failure can never leak a stack trace or a provider's error text.
 */
export function toErrorResponse(error: unknown): Response {
  if (isAppError(error)) {
    const body: ErrorBody = {
      error: { code: error.code, message: error.message },
      ...(isFieldErrors(error.details) ? { fieldErrors: error.details } : {}),
    };
    return Response.json(body, { status: error.statusCode });
  }

  console.error('Unhandled error on a public endpoint:', error);
  return Response.json(
    {
      error: {
        code: 'SERVER_REQUEST_FAILED',
        message: 'We could not send that just now. Please try again in a moment.',
      },
    } satisfies ErrorBody,
    { status: 500 },
  );
}

export function toSuccessResponse(message: string): Response {
  return Response.json({ ok: true, message }, { status: 200 });
}

function isFieldErrors(value: unknown): value is FieldErrors {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((entry) => typeof entry === 'string')
  );
}
