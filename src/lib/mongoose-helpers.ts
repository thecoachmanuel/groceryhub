import mongoose from 'mongoose';
import { NextRequest } from 'next/server';

/**
 * Build a Mongoose filter that matches either _id (ObjectId),
 * custom numeric ID, or string ID.
 */
export function buildIdFilter(idVal: any, customIdField?: string): any {
  if (idVal === undefined || idVal === null || idVal === '') return null;
  const strId = String(idVal).trim();
  const isValidObjectId = mongoose.Types.ObjectId.isValid(strId);
  const numId = parseInt(strId, 10);

  const conditions: any[] = [];
  if (isValidObjectId) {
    conditions.push({ _id: strId });
  }
  if (!isNaN(numId)) {
    conditions.push({ id: numId });
    if (customIdField) conditions.push({ [customIdField]: numId });
  }
  if (customIdField) {
    conditions.push({ [customIdField]: strId });
  }

  if (conditions.length === 0) return null;
  return conditions.length === 1 ? conditions[0] : { $or: conditions };
}

/**
 * Extract ID from either searchParams (?id=...) OR JSON body
 */
export async function extractRequestId(req: NextRequest, keys: string[] = ['id', '_id']): Promise<{ id: any; body: any }> {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const url = new URL(req.url);
  for (const k of keys) {
    const valFromUrl = url.searchParams.get(k);
    if (valFromUrl) return { id: valFromUrl, body };
  }

  for (const k of keys) {
    if (body[k] !== undefined && body[k] !== null && body[k] !== '') {
      return { id: body[k], body };
    }
  }

  return { id: null, body };
}
