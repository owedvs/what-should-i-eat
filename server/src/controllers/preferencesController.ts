import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const preferences = await prisma.preference.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Group preferences by type
    const grouped = preferences.reduce((acc: any, pref) => {
      if (!acc[pref.type]) {
        acc[pref.type] = [];
      }
      acc[pref.type].push({
        id: pref.id,
        value: pref.value,
        createdAt: pref.createdAt,
      });
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addPreference = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { type, value } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!type || !value) {
      return res.status(400).json({ error: 'Type and value are required' });
    }

    const preference = await prisma.preference.create({
      data: {
        userId,
        type,
        value,
      },
    });

    res.status(201).json(preference);
  } catch (error) {
    console.error('Add preference error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePreference = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const preference = await prisma.preference.findUnique({
      where: { id },
    });

    if (!preference) {
      return res.status(404).json({ error: 'Preference not found' });
    }

    if (preference.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.preference.delete({
      where: { id },
    });

    res.json({ message: 'Preference deleted successfully' });
  } catch (error) {
    console.error('Delete preference error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
