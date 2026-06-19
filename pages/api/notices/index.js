import prisma from '@/lib/prisma';
import { createNoticeSchema } from '@/lib/validations/notice';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// GET /api/notices — List all notices, Urgent first, then by publishDate desc
async function handleGet(req, res) {
  try {
    // Urgent-first ordering done in the database query as required.
    // PostgreSQL sorts enums alphabetically, so we use raw SQL CASE
    // to guarantee Urgent comes before Normal regardless of DB engine.
    const notices = await prisma.$queryRaw`
      SELECT
        id,
        title,
        body,
        category,
        priority,
        "publishDate",
        image,
        "createdAt",
        "updatedAt"
      FROM "Notice"
      ORDER BY
        CASE
          WHEN priority = 'Urgent' THEN 0
          WHEN priority = 'Normal' THEN 1
          ELSE 2
        END ASC,
        "publishDate" DESC
    `;

    // Serialize BigInt and Date fields for JSON response
    const serialized = notices.map((n) => ({
      ...n,
      id: Number(n.id),
      publishDate: n.publishDate instanceof Date ? n.publishDate.toISOString() : n.publishDate,
      createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : n.createdAt,
      updatedAt: n.updatedAt instanceof Date ? n.updatedAt.toISOString() : n.updatedAt,
    }));

    return res.status(200).json(serialized);
  } catch (error) {
    console.error('GET /api/notices error:', error);
    return res.status(500).json({ error: 'Failed to fetch notices' });
  }
}

// POST /api/notices — Create a new notice with server-side validation
async function handlePost(req, res) {
  try {
    // Server-side validation using Zod
    const result = createNoticeSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }

    const { title, body, category, priority, publishDate, image } = result.data;

    const notice = await prisma.notice.create({
      data: {
        title,
        body,
        category,
        priority,
        publishDate: new Date(publishDate),
        image: image || null,
      },
    });

    return res.status(201).json(notice);
  } catch (error) {
    console.error('POST /api/notices error:', error);
    return res.status(500).json({ error: 'Failed to create notice' });
  }
}
