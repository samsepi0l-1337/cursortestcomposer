import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().max(100).optional(),
  bio: z.string().max(500).optional().nullable(),
  image: z.string().url().optional().nullable(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export type ProfileResponse = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  role: string;
};
