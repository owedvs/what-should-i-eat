import axios from 'axios';
import type {
  AuthResponse,
  Preference,
  MealHistory,
  GroceryList,
  Subscription,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data: { email: string; password: string; name: string }) =>
  api.post<AuthResponse>('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data);

// Preferences
export const getPreferences = () =>
  api.get<Preference[]>('/preferences');

export const addPreference = (data: { type: string; value: string }) =>
  api.post<Preference>('/preferences', data);

export const deletePreference = (id: string) =>
  api.delete(`/preferences/${id}`);

// Meals
export const suggestMeal = (params?: { excludeRecent?: boolean; maxPrepTime?: number }) =>
  api.get<MealHistory>('/meals/suggest', { params });

export const getMealHistory = (limit?: number) =>
  api.get<MealHistory[]>('/meals/history', { params: { limit } });

export const rateMeal = (historyId: string, rating: number) =>
  api.patch<MealHistory>(`/meals/history/${historyId}/rate`, { rating });

// Grocery Lists
export const createGroceryList = (mealIds: string[]) =>
  api.post<GroceryList>('/grocery-lists', { mealIds });

export const getGroceryLists = () =>
  api.get<GroceryList[]>('/grocery-lists');

export const updateGroceryList = (
  id: string,
  data: { items?: any[]; completed?: boolean }
) => api.patch<GroceryList>(`/grocery-lists/${id}`, data);

// Subscription
export const createCheckoutSession = () =>
  api.post<{ sessionId: string; url: string }>('/subscription/checkout');

export const getSubscriptionStatus = () =>
  api.get<{ status: string; subscription: Subscription | null }>('/subscription/status');

export default api;
