import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ErrorCode } from '../constants/error-codes';

export interface ErrorResponse {
  error: string;
  code: string;
  details?: any;
}

export class APIError extends Error {
  public code: string;
  public status: number;
  public details?: any;

  constructor(message: string, code: string, status: number = 400, details?: any) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function handleAPIError(error: unknown): NextResponse<ErrorResponse> {
  console.error('[API Error]:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        code: ErrorCode.VALIDATION_ERROR,
        details: error.errors
      },
      { status: 400 }
    );
  }

  // Generic Error handling
  if (error instanceof Error) {
    // Handle Prisma specific errors if needed here or handle generically
    if (error.message.includes('not found') || error.message.includes('Not found')) {
      return NextResponse.json(
        { error: 'Resource not found', code: ErrorCode.NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message, code: ErrorCode.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error', code: ErrorCode.INTERNAL_SERVER_ERROR },
    { status: 500 }
  );
}

/**
 * Wrapper for API route handlers to automatically catch and format errors
 */
export function withErrorHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}
