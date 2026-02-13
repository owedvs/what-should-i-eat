import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const suggestMealSchema = z.object({
  excludeRecent: z.boolean().optional(),
  maxPrepTime: z.number().optional(),
});

const rateMealSchema = z.object({
  rating: z.number().min(1).max(5),
});

export const suggestMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { excludeRecent = true, maxPrepTime } = suggestMealSchema.parse(req.query);

    // Fetch user preferences grouped by type
    const preferences = await prisma.preference.findMany({
      where: { userId: req.userId! },
    });

    const likedFoods = preferences
      .filter((p) => p.type === 'liked_food')
      .map((p) => p.value.toLowerCase());
    const dislikedFoods = preferences
      .filter((p) => p.type === 'disliked_food')
      .map((p) => p.value.toLowerCase());
    const dietaryRestrictions = preferences
      .filter((p) => p.type === 'dietary_restriction')
      .map((p) => p.value.toLowerCase());
    const cuisinePreferences = preferences
      .filter((p) => p.type === 'cuisine_preference')
      .map((p) => p.value.toLowerCase());

    // Get recent meals (last 7 days) if excludeRecent is true
    let recentMealIds: string[] = [];
    if (excludeRecent) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentHistory = await prisma.mealHistory.findMany({
        where: {
          userId: req.userId!,
          suggestedAt: {
            gte: sevenDaysAgo,
          },
        },
        select: { mealId: true },
      });

      recentMealIds = recentHistory.map((h) => h.mealId);
    }

    // Query meals excluding recent ones
    interface MealsQuery {
      where: {
        id?: {
          notIn?: string[];
        };
        prepTime?: {
          lte: number;
        };
      };
    }

    const mealsQuery: MealsQuery = {
      where: {
        ...(recentMealIds.length > 0 && {
          id: {
            notIn: recentMealIds,
          },
        }),
      },
    };

    // Filter by max prep time if specified
    if (maxPrepTime) {
      mealsQuery.where.prepTime = { lte: maxPrepTime };
    }

    let meals = await prisma.meal.findMany(mealsQuery);

    // Filter by cuisine preferences (if any)
    if (cuisinePreferences.length > 0) {
      meals = meals.filter((meal) =>
        cuisinePreferences.includes(meal.cuisine.toLowerCase())
      );
    }

    // Client-side filtering for dietary restrictions and dislikes
    meals = meals.filter((meal) => {
      const ingredients = (meal.ingredients as string[]).map((i) => i.toLowerCase());
      const dietaryTags = (meal.dietaryTags as string[]).map((t) => t.toLowerCase());

      // Must match ALL dietary restrictions
      const meetsRestrictions = dietaryRestrictions.every((restriction) =>
        dietaryTags.includes(restriction)
      );

      // Must NOT contain any disliked ingredients
      const hasDisliked = dislikedFoods.some((disliked) =>
        ingredients.some((ingredient) => ingredient.includes(disliked))
      );

      return meetsRestrictions && !hasDisliked;
    });

    if (meals.length === 0) {
      res.status(404).json({ error: 'No meals found matching your preferences' });
      return;
    }

    // Score meals by counting liked ingredients
    const scoredMeals = meals.map((meal) => {
      const ingredients = (meal.ingredients as string[]).map((i) => i.toLowerCase());
      const score = likedFoods.reduce((acc, liked) => {
        return acc + ingredients.filter((ingredient) => ingredient.includes(liked)).length;
      }, 0);

      return { meal, score };
    });

    // Sort by score (highest first)
    scoredMeals.sort((a, b) => b.score - a.score);

    // Random selection from top 10
    const topMeals = scoredMeals.slice(0, Math.min(10, scoredMeals.length));
    const randomMeal = topMeals[Math.floor(Math.random() * topMeals.length)].meal;

    // Save to history
    const history = await prisma.mealHistory.create({
      data: {
        userId: req.userId!,
        mealId: randomMeal.id,
      },
      include: {
        meal: true,
      },
    });

    res.json(history);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Suggest meal error:', error);
    res.status(500).json({ error: 'Failed to suggest meal' });
  }
};

export const getMealHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const history = await prisma.mealHistory.findMany({
      where: { userId: req.userId! },
      include: { meal: true },
      orderBy: { suggestedAt: 'desc' },
      take: limit,
    });

    res.json(history);
  } catch (error) {
    console.error('Get meal history error:', error);
    res.status(500).json({ error: 'Failed to fetch meal history' });
  }
};

export const rateMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { historyId } = req.params;
    const { rating } = rateMealSchema.parse(req.body);

    const history = await prisma.mealHistory.findUnique({
      where: { id: historyId },
    });

    if (!history) {
      res.status(404).json({ error: 'Meal history not found' });
      return;
    }

    if (history.userId !== req.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const updated = await prisma.mealHistory.update({
      where: { id: historyId },
      data: { rating },
      include: { meal: true },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Rate meal error:', error);
    res.status(500).json({ error: 'Failed to rate meal' });
  }
};
