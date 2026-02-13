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

const router = Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Preferences routes (protected)
router.get('/preferences', authenticate, getPreferences);
router.post('/preferences', authenticate, addPreference);
router.delete('/preferences/:id', authenticate, deletePreference);

// Meals routes (protected)
router.get('/meals/suggest', authenticate, suggestMeal);
router.get('/meals/history', authenticate, getMealHistory);
router.patch('/meals/history/:historyId/rate', authenticate, rateMeal);

// Grocery lists routes (protected)
router.post('/grocery-lists', authenticate, createGroceryList);
router.get('/grocery-lists', authenticate, getGroceryLists);
router.patch('/grocery-lists/:id', authenticate, updateGroceryList);

// Subscription routes (protected)
router.post('/subscription/checkout', authenticate, createCheckoutSession);
router.get('/subscription/status', authenticate, getSubscriptionStatus);

// Stripe webhook (raw body)
router.post('/webhooks/stripe', handleWebhook);

export default router;
