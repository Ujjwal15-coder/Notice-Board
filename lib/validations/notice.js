import { z } from 'zod';

const VALID_CATEGORIES = ['Exam', 'Event', 'General'];
const VALID_PRIORITIES = ['Normal', 'Urgent'];

// Schema for creating a new notice
export const createNoticeSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  body: z
    .string({ required_error: 'Body is required' })
    .min(1, 'Body cannot be empty')
    .trim(),
  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({
      message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
    }),
  }),
  priority: z
    .enum(VALID_PRIORITIES, {
      errorMap: () => ({
        message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
      }),
    })
    .default('Normal'),
  publishDate: z
    .string({ required_error: 'Publish date is required' })
    .min(1, 'Publish date is required')
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Publish date must be a valid date' }
    ),
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .or(z.literal(''))
    .or(z.null())
    .transform((val) => (val === '' ? null : val)),
});

// Schema for updating a notice — all fields optional but validated if present
export const updateNoticeSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or less')
    .trim()
    .optional(),
  body: z
    .string()
    .min(1, 'Body cannot be empty')
    .trim()
    .optional(),
  category: z
    .enum(VALID_CATEGORIES, {
      errorMap: () => ({
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      }),
    })
    .optional(),
  priority: z
    .enum(VALID_PRIORITIES, {
      errorMap: () => ({
        message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
      }),
    })
    .optional(),
  publishDate: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Publish date must be a valid date' }
    )
    .optional(),
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .or(z.literal(''))
    .or(z.null())
    .transform((val) => (val === '' ? null : val)),
});
