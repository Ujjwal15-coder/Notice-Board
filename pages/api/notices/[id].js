import prisma from '@/lib/prisma';
import { updateNoticeSchema } from '@/lib/validations/notice';

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = Number(id);

  if (isNaN(noticeId) || noticeId <= 0) {
    return res.status(400).json({ error: 'Invalid notice ID' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(noticeId, res);
    case 'PUT':
      return handlePut(noticeId, req, res);
    case 'DELETE':
      return handleDelete(noticeId, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// GET /api/notices/:id — Get a single notice
async function handleGet(noticeId, res) {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: noticeId },
    });

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    return res.status(200).json(notice);
  } catch (error) {
    console.error(`GET /api/notices/${noticeId} error:`, error);
    return res.status(500).json({ error: 'Failed to fetch notice' });
  }
}

// PUT /api/notices/:id — Update a notice with server-side validation
async function handlePut(noticeId, req, res) {
  try {
    // Check if notice exists
    const existing = await prisma.notice.findUnique({
      where: { id: noticeId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    // Server-side validation using Zod
    const result = updateNoticeSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
    }

    const { title, body, category, priority, publishDate, image } = result.data;

    // Build update data, only including fields that were provided
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (body !== undefined) updateData.body = body;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (publishDate !== undefined) updateData.publishDate = new Date(publishDate);
    if (image !== undefined) updateData.image = image || null;

    const notice = await prisma.notice.update({
      where: { id: noticeId },
      data: updateData,
    });

    return res.status(200).json(notice);
  } catch (error) {
    console.error(`PUT /api/notices/${noticeId} error:`, error);
    return res.status(500).json({ error: 'Failed to update notice' });
  }
}

// DELETE /api/notices/:id — Delete a notice
async function handleDelete(noticeId, res) {
  try {
    const existing = await prisma.notice.findUnique({
      where: { id: noticeId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    await prisma.notice.delete({
      where: { id: noticeId },
    });

    return res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/notices/${noticeId} error:`, error);
    return res.status(500).json({ error: 'Failed to delete notice' });
  }
}
