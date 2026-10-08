import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
const challenges = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/challenges" }),
  schema: z.object({
    title: z.string(),
    pillar: z.enum(["Identity", "Stewardship", "Service", "Dominion"]),
    level: z.enum(["Apprentice", "Pathfinder", "Vanguard"]),
    description: z.string(),
    purpose: z.string(),
    difficulty: z.number().int().min(1).max(3),
    effort: z.string(),
    foundation7: z.boolean(),
    sequence: z.number().optional(),
    prerequisites: z.array(z.string()),
    required: z.boolean(),
    adult: z.enum([
      "Parent",
      "Pastor / Teacher",
      "Mentor",
      "Skilled Church Member",
      "None",
    ]),
    adultNotes: z.string(),
    skills: z.array(z.string()),
    requirements: z.array(z.string()),
    checklist: z.array(z.string()),
    materials: z.array(z.string()),
    learning: z.array(z.string()),
    adultGuide: z.object({
      prepare: z.array(z.string()),
      observe: z.array(z.string()),
      questions: z.array(z.string()),
      criteria: z.array(z.string()),
    }),
    demonstration: z.string(),
    signoff: z.string(),
    resources: z.array(
      z.object({
        title: z.string(),
        level: z.enum(["Apprentice", "Pathfinder", "Vanguard"]),
        url: z.string().optional(),
      }),
    ),
    scripture: z.object({ reference: z.string(), text: z.string() }),
    notes: z.string(),
    sample: z.literal(true),
  }),
});
export const collections = { challenges };
