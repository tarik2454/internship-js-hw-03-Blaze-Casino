import { z } from "zod";

export const UserSchema = z
  .object({
    _id: z.string().optional(),
    username: z.string(),
    balance: z.number().nullish(),
    totalWagered: z.number().nullish(),
    gamesPlayed: z.number().nullish(),
    totalWon: z.number().nullish(),
  })
  .transform((data) => ({
    _id: data._id ?? "",
    username: data.username,
    balance: data.balance ?? null,
    totalWagered: data.totalWagered ?? null,
    gamesPlayed: data.gamesPlayed ?? null,
    totalWon: data.totalWon ?? null,
  }));

export const AuthResponseSchema = z.object({
  token: z.string(),
});

export const UserStatsSchema = z.object({
  username: z.string(),
  balance: z.number(),
  totalWagered: z.number(),
  gamesPlayed: z.number(),
  totalWon: z.number(),
});

export const UserArraySchema = z.array(UserSchema);

export const PlinkoSettingsSchema = z.object({
  risk: z.enum(["LOW", "MEDIUM", "HIGH"]),
  balls: z.number(),
  lines: z.number(),
  soundEnabled: z.boolean(),
});

export const DropResultSchema = z.object({
  multiplier: z.number(),
  payout: z.number(),
  slotIndex: z.number(),
});

export const PlinkoHistoryItemSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  bet: z.number(),
  balls: z.number(),
  risk: z.enum(["LOW", "MEDIUM", "HIGH"]),
  lines: z.number(),
  results: z.array(DropResultSchema),
});

export const PlinkoHistoryArraySchema = z.array(PlinkoHistoryItemSchema);

