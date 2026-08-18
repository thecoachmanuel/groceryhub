import { NextResponse } from 'next/server';

export interface ApiResponseOptions {
  status?: number;
  result?: string | boolean;
  message?: string;
  data?: any;
  [key: string]: any;
}

export function apiSuccess(data: any = null, message: string = 'Success', extra: Record<string, any> = {}) {
  return NextResponse.json({
    status: 200,
    result: 'true',
    message,
    ...(data !== null ? { data } : {}),
    ...extra,
  });
}

export function apiError(message: string = 'Something went wrong', status: number = 400, extra: Record<string, any> = {}) {
  return NextResponse.json(
    {
      status,
      result: 'false',
      message,
      ...extra,
    },
    { status }
  );
}
