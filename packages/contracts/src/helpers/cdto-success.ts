import { ZodArray, ZodObject, ZodRawShape, z } from 'zod';
import { HttpStatus } from '../types';

export const cdtoSuccess = <
  T extends ZodObject<ZodRawShape> | ZodArray<ZodObject<ZodRawShape>>,
>(
  data: T,
  statusCode: HttpStatus.OK | HttpStatus.CREATED = 200,
) => {
  const successResponseSchema = z.object({
    statusCode: z.literal(statusCode),
    message: z.string(),
    data: data.optional(),
  });

  return successResponseSchema.extend({
    data,
  });
};

export const cdtoAcknowledgment = () =>
  z.object({
    statusCode: z.literal(204),
    message: z.string(),
  });