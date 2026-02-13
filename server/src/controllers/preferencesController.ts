import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const addPreferenceSchema = z.object({
  type: z.enum(['liked_food', 'disliked_food', 'dietary_restriction', 'cuisine_preference']),
  value: z.string().min(1),
});

export const getPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const preferences = await prisma.preference.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    res.json(preferences);
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
};

export const addPreference = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, value } = addPreferenceSchema.parse(req.body);

    const existingPreference = await prisma.preference.findFirst({
      where: {
        userId: req.userId!,
        type,
        value,
      },
    });

    if (existingPreference) {
      res.status(400).json({ error: 'Preference already exists' });
      return;
    }

    const preference = await prisma.preference.create({
      data: {
        userId: req.userId!,
        type,
        value,
      },
    });

    res.status(201).json(preference);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Add preference error:', error);
    res.status(500).json({ error: 'Failed to add preference' });
  }
};

export const deletePreference = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const preference = await prisma.preference.findUnique({ where: { id } });

    if (!preference) {
      res.status(404).json({ error: 'Preference not found' });
      return;
    }

    if (preference.userId !== req.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await prisma.preference.delete({ where: { id } });

    res.json({ message: 'Preference deleted' });
  } catch (error) {
    console.error('Delete preference error:', error);
    res.status(500).json({ error: 'Failed to delete preference' });
  }
};
