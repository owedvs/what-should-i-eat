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

const router = Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Preferences routes (protected)
router.get('/preferences', authenticateToken, getPreferences);
router.post('/preferences', authenticateToken, addPreference);
router.delete('/preferences/:id', authenticateToken, deletePreference);

// Meals routes (protected)
router.post('/meals/suggest', authenticateToken, suggestMeal);
router.get('/meals/history', authenticateToken, getMealHistory);
router.post('/meals/history/:id/rate', authenticateToken, rateMeal);

// Grocery routes (protected)
router.post('/grocery', authenticateToken, createGroceryList);
router.get('/grocery', authenticateToken, getGroceryLists);
router.put('/grocery/:id', authenticateToken, updateGroceryList);

// Subscription routes
router.post('/subscription/checkout', authenticateToken, createCheckoutSession);
router.post('/subscription/webhook', webhookHandler); // Not protected - uses Stripe signature
router.get('/subscription/status', authenticateToken, getSubscriptionStatus);

export default router;
