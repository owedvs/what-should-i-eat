import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createGroceryListSchema = z.object({
  mealIds: z.array(z.string()),
});

const updateGroceryListSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      checked: z.boolean(),
    })
  ).optional(),
  completed: z.boolean().optional(),
});

export const createGroceryList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mealIds } = createGroceryListSchema.parse(req.body);

    const meals = await prisma.meal.findMany({
      where: { id: { in: mealIds } },
    });

    // Combine all ingredients from selected meals
    const allIngredients = new Set<string>();
    meals.forEach((meal) => {
      (meal.ingredients as string[]).forEach((ingredient) => {
        allIngredients.add(ingredient);
      });
    });

    const items = Array.from(allIngredients).map((name) => ({
      name,
      checked: false,
    }));

    const groceryList = await prisma.groceryList.create({
      data: {
        userId: req.userId!,
        items: items,
      },
    });

    res.status(201).json(groceryList);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Create grocery list error:', error);
    res.status(500).json({ error: 'Failed to create grocery list' });
  }
};

export const getGroceryLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const lists = await prisma.groceryList.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    res.json(lists);
  } catch (error) {
    console.error('Get grocery lists error:', error);
    res.status(500).json({ error: 'Failed to fetch grocery lists' });
  }
};

export const updateGroceryList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = updateGroceryListSchema.parse(req.body);

    const groceryList = await prisma.groceryList.findUnique({ where: { id } });

    if (!groceryList) {
      res.status(404).json({ error: 'Grocery list not found' });
      return;
    }

    if (groceryList.userId !== req.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const updated = await prisma.groceryList.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Update grocery list error:', error);
    res.status(500).json({ error: 'Failed to update grocery list' });
  }
};
