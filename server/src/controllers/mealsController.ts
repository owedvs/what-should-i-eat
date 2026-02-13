import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const suggestMeal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { excludeRecent, maxPrepTime } = req.body;

    // Get user preferences
    const preferences = await prisma.preference.findMany({
      where: { userId },
    });

    const dietaryRestrictions = preferences
      .filter((p) => p.type === 'dietary')
      .map((p) => p.value.toLowerCase());

    const allergies = preferences
      .filter((p) => p.type === 'allergy')
      .map((p) => p.value.toLowerCase());

    const preferredCuisines = preferences
      .filter((p) => p.type === 'cuisine')
      .map((p) => p.value.toLowerCase());

    const likedIngredients = preferences
      .filter((p) => p.type === 'ingredient')
      .map((p) => p.value.toLowerCase());

    // Get recent meal history if excludeRecent is enabled
    let recentMealIds: string[] = [];
    if (excludeRecent) {
      const recentHistory = await prisma.mealHistory.findMany({
        where: { userId },
        orderBy: { suggestedAt: 'desc' },
        take: 5,
        select: { mealId: true },
      });
      recentMealIds = recentHistory.map((h) => h.mealId);
    }

    // Get all meals
    let meals = await prisma.meal.findMany();

    // Filter by recent meals
    if (recentMealIds.length > 0) {
      meals = meals.filter((meal) => !recentMealIds.includes(meal.id));
    }

    // Filter by prep time
    if (maxPrepTime && maxPrepTime > 0) {
      meals = meals.filter((meal) => !meal.prepTime || meal.prepTime <= maxPrepTime);
    }

    // Score meals based on preferences
    const scoredMeals = meals.map((meal) => {
      let score = 0;

      const mealTags = (meal.dietaryTags as string[]).map((tag) =>
        tag.toLowerCase()
      );
      const mealIngredients = (meal.ingredients as string[]).map((ing) =>
        ing.toLowerCase()
      );
      const mealCuisine = meal.cuisine?.toLowerCase() || '';

      // Check dietary restrictions (must match all)
      const meetsDietaryReqs = dietaryRestrictions.every((restriction) =>
        mealTags.includes(restriction)
      );
      if (!meetsDietaryReqs && dietaryRestrictions.length > 0) {
        return { meal, score: -1 }; // Disqualify
      }

      // Check allergies (must not contain any)
      const hasAllergies = allergies.some((allergy) =>
        mealIngredients.some((ing) => ing.includes(allergy))
      );
      if (hasAllergies) {
        return { meal, score: -1 }; // Disqualify
      }

      // Boost score for preferred cuisines
      if (preferredCuisines.length > 0 && preferredCuisines.includes(mealCuisine)) {
        score += 10;
      }

      // Boost score for liked ingredients
      likedIngredients.forEach((liked) => {
        if (mealIngredients.some((ing) => ing.includes(liked))) {
          score += 5;
        }
      });

      return { meal, score };
    });

    // Filter out disqualified meals
    const qualifiedMeals = scoredMeals.filter((sm) => sm.score >= 0);

    if (qualifiedMeals.length === 0) {
      return res
        .status(404)
        .json({ error: 'No meals found matching your preferences' });
    }

    // Sort by score and take top 10
    qualifiedMeals.sort((a, b) => b.score - a.score);
    const topMeals = qualifiedMeals.slice(0, 10);

    // Random selection from top 10
    const selectedMeal = topMeals[Math.floor(Math.random() * topMeals.length)].meal;

    // Record in meal history
    const mealHistory = await prisma.mealHistory.create({
      data: {
        userId,
        mealId: selectedMeal.id,
      },
    });

    res.json({
      meal: selectedMeal,
      historyId: mealHistory.id,
    });
  } catch (error) {
    console.error('Suggest meal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMealHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 10;

    const history = await prisma.mealHistory.findMany({
      where: { userId },
      include: {
        meal: true,
      },
      orderBy: { suggestedAt: 'desc' },
      take: limit,
    });

    res.json(history);
  } catch (error) {
    console.error('Get meal history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const rateMeal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { rating } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const mealHistory = await prisma.mealHistory.findUnique({
      where: { id },
    });

    if (!mealHistory) {
      return res.status(404).json({ error: 'Meal history not found' });
    }

    if (mealHistory.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.mealHistory.update({
      where: { id },
      data: { rating },
    });

    res.json(updated);
  } catch (error) {
    console.error('Rate meal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
