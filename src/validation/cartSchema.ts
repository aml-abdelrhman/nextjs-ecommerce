
import { z } from "zod";

export const cartItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().min(0),
  image: z.string().optional(),
  qty: z.number().int().min(1).default(1),
});
