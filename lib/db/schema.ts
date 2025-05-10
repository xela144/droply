import {
  pgTable,
  timestamp,
  text,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  // Unique identifier for each file/folder
  id: uuid("id").defaultRandom().primaryKey(),

  // add basic file/folder information
  name: text("name").notNull(),
  path: text("path").notNull(), // Storage path as presented to user
  size: integer("size").notNull(),
  type: text("type").notNull(), // "folder", etc

  // Storage url on backend (imagekit, etc)
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),

  // Ownership
  userId: text("user_id").notNull(),
  parentId: uuid("parent_id"), // Null for root files

  // file/folder flags
  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * File Relations
 *
 * This defines the relationships between records in our files table:
 * 1. parent - Each file/folder can have one parent folder
 * 2. children - Each folder can have many child files/folders
 *
 * This creates a hierarchical file structure similar to a real filesystem.
 */
export const filesRelations = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),

  children: many(files),
}));

/**
 * Type Definitions
 *
 * These types help with TypeScript integration:
 * - File: Type for retrieving file data from the database
 * - NewFile: Type for inserting new file data into the database
 */
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
