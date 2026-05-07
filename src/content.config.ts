import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";
import { protectConfig } from "./content/consts";

const baseSchema = z.strictObject({
  title: z
    .string()
    .min(1, "Title cannot be empty.")
    .max(64, "Title cannot exceed 64 characters."),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Format error, see README.md in submodule.",
    )
    .min(1, "Slug cannot be empty.")
    .max(32, "Slug cannot exceed 32 characters."),
  author: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Format error, see README.md in submodule.",
    )
    .min(1, "Author slug cannot be empty.")
    .max(32, "Author slug cannot exceed 32 characters.")
    .optional(),
  description: z
    .string()
    .min(1, "Description cannot be empty.")
    .max(256, "Description cannot exceed 256 characters.")
    .optional()
    .default("No description provided."),
  draft: z.boolean(),
  pubDate: z.coerce.date(),
  updDate: z.coerce.date().optional(),
});

const cpub = defineCollection({
  loader: glob({ base: "./src/content/public", pattern: "**/*.md" }),
  schema: ({ image }) =>
    baseSchema.extend({
      banner: z.optional(image()),
      protected: z.boolean().refine((val) => val === false, {
        error: "Public content cannot be protected.",
        path: ["protected"],
      }),
    }),
});

const cpriv = defineCollection({
  loader: glob({ base: "./src/content/private", pattern: "**/*.md" }),
  schema: ({ image }) =>
    baseSchema.extend({
      banner: z.optional(image()),
      protected: z.boolean().refine((val) => val === true, {
        error: "Private content cannot be public.",
        path: ["protected"],
      }),
      question: z.string().optional().default(protectConfig.question),
      password: z
        .string()
        .regex(
          /[a-zA-Z0-9!@#$%^&*]/,
          "Format error, see README.md in submodule.",
        )
        .min(1, "Slug cannot be empty.")
        .max(32, "Slug cannot exceed 32 characters.")
        .optional()
        .default(protectConfig.password),
    }),
});

const author = defineCollection({
  loader: file("./src/content/author.json"),
  schema: z.object({
    slug: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Format error, see README.md in submodule.",
      )
      .min(1, "Slug cannot be empty.")
      .max(32, "Slug cannot exceed 32 characters."),
    name: z.string(),
    description: z
      .string()
      .min(1, "Description cannot be empty.")
      .max(256, "Description cannot exceed 256 characters.")
      .optional()
      .default("No description provided."),
    url: z.string().optional(),
  }),
});

export const collections = { cpub, cpriv, author };
