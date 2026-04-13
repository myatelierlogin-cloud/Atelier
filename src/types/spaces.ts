import { z } from "zod";

export const SpaceTypeEnum = z.enum([
  "SINGLE_ITEM_SPACE",
  "TAGGABLE_ITEM_SPACE",
  "DIGITAL_ITEM_SPACE",
]);

export const BaseSpaceSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  type: SpaceTypeEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(["draft", "published"]),
  displayOrder: z.number().default(0),
});

export const SingleItemContentSchema = z.object({
  productId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  affiliateLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

export const TaggableItemContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Image URL is required"),
  taggedItems: z.array(
    z.object({
      itemId: z.string(),
      x: z.number(),
      y: z.number(),
      title: z.string(),
      link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      price: z.string().optional(),
    })
  ),
});

export const DigitalItemContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  digitalAssetUrl: z.string().url("Asset URL is required"),
  price: z.string().optional(),
  thumbnailUrl: z.string().url("Thumbnail URL is required").optional().or(z.literal("")),
});

export const SingleItemSpaceSchema = BaseSpaceSchema.extend({
  type: z.literal(SpaceTypeEnum.enum.SINGLE_ITEM_SPACE),
  content: SingleItemContentSchema,
});

export const TaggableItemSpaceSchema = BaseSpaceSchema.extend({
  type: z.literal(SpaceTypeEnum.enum.TAGGABLE_ITEM_SPACE),
  content: TaggableItemContentSchema,
});

export const DigitalItemSpaceSchema = BaseSpaceSchema.extend({
  type: z.literal(SpaceTypeEnum.enum.DIGITAL_ITEM_SPACE),
  content: DigitalItemContentSchema,
});

// Discriminated Union for the full Space object
export const SpaceSchema = z.discriminatedUnion("type", [
  SingleItemSpaceSchema,
  TaggableItemSpaceSchema,
  DigitalItemSpaceSchema,
]);

export type SpaceType = z.infer<typeof SpaceTypeEnum>;
export type SingleItemSpace = z.infer<typeof SingleItemSpaceSchema>;
export type TaggableItemSpace = z.infer<typeof TaggableItemSpaceSchema>;
export type DigitalItemSpace = z.infer<typeof DigitalItemSpaceSchema>;
export type Space = z.infer<typeof SpaceSchema>;
