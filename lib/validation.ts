import { z } from 'zod';

// Save progress validation
export const saveProgressSchema = z.object({
  videoId: z.string().min(1).max(20),
  url: z.string().url().optional(),
  title: z.string().max(500).optional(),
  chapters: z.array(z.object({
    title: z.string().max(500),
    time: z.string().max(20),
    url: z.string().url(),
    videoId: z.string().max(20).optional(),
  })).optional(),
  progress: z.object({
    completedChapters: z.array(z.number()),
    lastWatchedChapter: z.number(),
    progressPercentage: z.number().min(0).max(100),
    totalWatchTime: z.number().min(0),
    timestamp: z.number(),
  }).optional(),
});

// Save note validation
export const saveNoteSchema = z.object({
  videoId: z.string().min(1).max(20),
  chapterIndex: z.number().int().min(0),
  note: z.string().min(1).max(10000),
  timestamp: z.number().optional(),
});

// Delete note validation
export const deleteNoteSchema = z.object({
  noteId: z.string().min(1),
});

// Update note validation
export const updateNoteSchema = z.object({
  noteId: z.string().min(1),
  note: z.string().min(1).max(10000),
});

// Save bookmark validation
export const saveBookmarkSchema = z.object({
  videoId: z.string().min(1).max(20),
  chapterIndex: z.number().int().min(0),
  timestamp: z.number(),
  title: z.string().max(200).optional(),
});

// Delete bookmark validation
export const deleteBookmarkSchema = z.object({
  bookmarkId: z.string().min(1),
});

// Update bookmark validation
export const updateBookmarkSchema = z.object({
  bookmarkId: z.string().min(1),
  title: z.string().min(1).max(200),
});

// Delete course validation
export const deleteCourseSchema = z.object({
  videoId: z.string().min(1).max(20),
});

// Contact form validation
export const contactSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(255).optional(),
  message: z.string().min(1).max(5000),
});

// Certificate validation
export const createCertificateSchema = z.object({
  videoId: z.string().min(1).max(20),
  courseTitle: z.string().max(500).optional(),
  totalWatchTime: z.number().min(0).optional(),
  chaptersCompleted: z.number().int().min(0).optional(),
  totalChapters: z.number().int().min(0).optional(),
  userName: z.string().max(255).optional(),
});

// YouTube chapters validation
export const youtubeChaptersSchema = z.object({
  videoId: z.string().max(20).optional(),
  playlistId: z.string().max(50).optional(),
}).refine(data => data.videoId || data.playlistId, {
  message: "Either videoId or playlistId is required",
});
