import { Router } from 'express';
import { register, login } from '../controllers/authController';
import {
  getPreferences,
  addPreference,
  deletePreference,
} from '../controllers/preferencesController';
import {
  suggestMeal,
  getMealHistory,
  rateMeal,
} from '../controllers/mealsController';
import {
  createGroceryList,
  getGroceryLists,
  updateGroceryList,
} from '../controllers/groceryController';
import {
  createCheckoutSession,
  webhookHandler,
  getSubscriptionStatus,
} from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/auth';
import { apiLimiter, authLimiter, mealSuggestionLimiter } from '../middleware/rateLimit';

const router = Router();

// Auth routes (with stricter rate limiting)
router.post('/auth/register', authLimiter, register);
router.post('/auth/login', authLimiter, login);

// Preferences routes (protected with rate limiting)
router.get('/preferences', apiLimiter, authenticateToken, getPreferences);
router.post('/preferences', apiLimiter, authenticateToken, addPreference);
router.delete('/preferences/:id', apiLimiter, authenticateToken, deletePreference);

// Meals routes (protected with rate limiting)
router.post('/meals/suggest', mealSuggestionLimiter, authenticateToken, suggestMeal);
router.get('/meals/history', apiLimiter, authenticateToken, getMealHistory);
router.post('/meals/history/:id/rate', apiLimiter, authenticateToken, rateMeal);

// Grocery routes (protected with rate limiting)
router.post('/grocery', apiLimiter, authenticateToken, createGroceryList);
router.get('/grocery', apiLimiter, authenticateToken, getGroceryLists);
router.put('/grocery/:id', apiLimiter, authenticateToken, updateGroceryList);

// Subscription routes (with rate limiting)
router.post('/subscription/checkout', apiLimiter, authenticateToken, createCheckoutSession);
router.post('/subscription/webhook', webhookHandler); // Not rate limited - uses Stripe signature
router.get('/subscription/status', apiLimiter, authenticateToken, getSubscriptionStatus);

export default router;
