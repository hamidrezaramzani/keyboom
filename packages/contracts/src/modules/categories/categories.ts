import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const category = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string(),
  key: z.string(),
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const categoryActions = {
  readMany: {
    response: {
      ok: cdtoSuccess(z.array(category)),
    },
  },
} as const;

export type CategoryActions = Actions<typeof categoryActions>;

export class CategoryReadManyResponseOkDto extends createZodDto(
  categoryActions.readMany.response.ok,
) {}
