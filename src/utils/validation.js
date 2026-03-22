/**
 * Form validation schemas using Zod
 * All user inputs validated against these schemas before submission
 */

import { z } from 'zod';

// Email validation regex
const _EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+()]+$/;

/**
 * User/Authentication Schemas
 */
export const authSchemas = {
  register: z.object({
    email: z.string()
      .email('Invalid email format')
      .min(5, 'Email too short')
      .max(100, 'Email too long'),
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password too long')
      .regex(/[A-Z]/, 'Password must contain uppercase letter')
      .regex(/[a-z]/, 'Password must contain lowercase letter')
      .regex(/[0-9]/, 'Password must contain number'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),

  login: z.object({
    email: z.string()
      .email('Invalid email format'),
    password: z.string()
      .min(1, 'Password required'),
  }),

  resetPassword: z.object({
    email: z.string()
      .email('Invalid email format'),
  }),
};

/**
 * Scout/User Profile Schemas
 */
export const userSchemas = {
  scoutProfile: z.object({
    name: z.string()
      .min(2, 'Name too short')
      .max(50, 'Name too long'),
    email: z.string()
      .email('Invalid email'),
    phone: z.string()
      .optional()
      .refine((val) => !val || PHONE_REGEX.test(val), 'Invalid phone number'),
    rank: z.enum(['Scout', 'Tenderfoot', 'Second Class', 'First Class', 'Star', 'Life', 'Eagle']),
    joinDate: z.string()
      .datetime()
      .optional(),
  }),

  leaderProfile: z.object({
    name: z.string()
      .min(2, 'Name too short')
      .max(50, 'Name too long'),
    email: z.string()
      .email('Invalid email'),
    phone: z.string()
      .optional()
      .refine((val) => !val || PHONE_REGEX.test(val), 'Invalid phone number'),
    role: z.enum(['Scoutmaster', 'Assistant Scoutmaster', 'Merit Badge Counselor', 'Advancement Chair']),
  }),
};

/**
 * Activity & Event Schemas
 */
export const activitySchemas = {
  create: z.object({
    title: z.string()
      .min(3, 'Title too short')
      .max(100, 'Title too long'),
    type: z.enum(['activity', 'event']),
    date: z.string()
      .datetime('Invalid date')
      .refine((val) => new Date(val) > new Date(), 'Event must be in the future'),
    time: z.string()
      .regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    location: z.string()
      .min(3, 'Location too short')
      .max(200, 'Location too long'),
    description: z.string()
      .min(10, 'Description too short')
      .max(1000, 'Description too long'),
    spots: z.number()
      .min(1, 'Must have at least 1 spot')
      .max(500, 'Too many spots'),
    dues: z.number()
      .min(0, 'Dues cannot be negative')
      .max(10000, 'Dues too high')
      .optional(),
  }),

  update: z.object({
    title: z.string()
      .min(3, 'Title too short')
      .max(100, 'Title too long')
      .optional(),
    description: z.string()
      .min(10, 'Description too short')
      .max(1000, 'Description too long')
      .optional(),
    location: z.string()
      .min(3, 'Location too short')
      .max(200, 'Location too long')
      .optional(),
    spots: z.number()
      .min(1, 'Must have at least 1 spot')
      .max(500, 'Too many spots')
      .optional(),
  }),
};

/**
 * Announcement Schemas
 */
export const announcementSchemas = {
  create: z.object({
    title: z.string()
      .min(3, 'Title too short')
      .max(200, 'Title too long'),
    body: z.string()
      .min(10, 'Message too short')
      .max(2000, 'Message too long'),
    pinned: z.boolean()
      .optional(),
  }),
};

/**
 * Invitation Schemas
 */
export const invitationSchemas = {
  create: z.object({
    role: z.enum(['scout', 'leader']),
    expiresInDays: z.number()
      .min(1, 'Must be at least 1 day')
      .max(365, 'Cannot be more than 1 year')
      .default(30),
  }),
};

/**
 * Validate data against schema
 * Returns { valid: boolean, errors: Record<string, string> }
 */
export function validate(data, schema) {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { valid: true, errors: {} };
    }

    const errors = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });

    return { valid: false, errors };
  } catch (_error) {
    return { valid: false, errors: { _global: 'Validation error' } };
  }
}

/**
 * Validate and throw on error
 */
export function validateOrThrow(data, schema, context = '') {
  const result = validate(data, schema);
  if (!result.valid) {
    const errorMessages = Object.entries(result.errors)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
    throw new Error(`Validation failed${context ? ` (${context})` : ''}: ${errorMessages}`);
  }
  return result;
}
