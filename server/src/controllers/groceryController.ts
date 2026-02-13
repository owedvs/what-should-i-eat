import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, GroceryItem } from '../types';

const prisma = new PrismaClient();

export const createGroceryList = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { mealIds } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!Array.isArray(mealIds) || mealIds.length === 0) {
      return res.status(400).json({ error: 'Meal IDs array is required' });
    }

    // Fetch meals
    const meals = await prisma.meal.findMany({
      where: {
        id: { in: mealIds },
      },
    });

    if (meals.length === 0) {
      return res.status(404).json({ error: 'No meals found' });
    }

    // Merge ingredients from all meals
    const ingredientsMap = new Map<string, GroceryItem>();

    meals.forEach((meal) => {
      const ingredients = meal.ingredients as string[];
      ingredients.forEach((ingredient) => {
        const normalizedName = ingredient.toLowerCase();
        if (ingredientsMap.has(normalizedName)) {
          const existing = ingredientsMap.get(normalizedName)!;
          existing.quantity += 1;
        } else {
          ingredientsMap.set(normalizedName, {
            name: ingredient,
            quantity: 1,
            unit: 'serving',
            checked: false,
          });
        }
      });
    });

    const items = Array.from(ingredientsMap.values());

    // Create grocery list
    const groceryList = await prisma.groceryList.create({
      data: {
        userId,
        items: items as any,
        completed: false,
      },
    });

    res.status(201).json(groceryList);
  } catch (error) {
    console.error('Create grocery list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGroceryLists = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const groceryLists = await prisma.groceryList.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(groceryLists);
  } catch (error) {
    console.error('Get grocery lists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateGroceryList = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { items, completed } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const groceryList = await prisma.groceryList.findUnique({
      where: { id },
    });

    if (!groceryList) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }

    if (groceryList.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updateData: any = {};
    if (items !== undefined) {
      updateData.items = items;
    }
    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const updated = await prisma.groceryList.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    console.error('Update grocery list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
