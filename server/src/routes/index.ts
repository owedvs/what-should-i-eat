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
  getSubscriptionStatus,
  handleWebhook,
} from '../controllers/subscriptionController';
import { authenticate } from '../middleware/auth';
import { apiLimiter, authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Auth routes with strict rate limiting
router.post('/auth/register', authLimiter, register);
router.post('/auth/login', authLimiter, login);

// Preferences routes (protected with rate limiting)
router.get('/preferences', apiLimiter, authenticate, getPreferences);
router.post('/preferences', apiLimiter, authenticate, addPreference);
router.delete('/preferences/:id', apiLimiter, authenticate, deletePreference);

// Meals routes (protected with rate limiting)
router.get('/meals/suggest', apiLimiter, authenticate, suggestMeal);
router.get('/meals/history', apiLimiter, authenticate, getMealHistory);
router.patch('/meals/history/:historyId/rate', apiLimiter, authenticate, rateMeal);

// Grocery lists routes (protected with rate limiting)
router.post('/grocery-lists', apiLimiter, authenticate, createGroceryList);
router.get('/grocery-lists', apiLimiter, authenticate, getGroceryLists);
router.patch('/grocery-lists/:id', apiLimiter, authenticate, updateGroceryList);

// Subscription routes (protected with rate limiting)
router.post('/subscription/checkout', apiLimiter, authenticate, createCheckoutSession);
router.get('/subscription/status', apiLimiter, authenticate, getSubscriptionStatus);

// Stripe webhook (raw body, no rate limiting for webhooks as they're from Stripe)
router.post('/webhooks/stripe', handleWebhook);

export default router;
