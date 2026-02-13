import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import {
  AuthResponse,
  Preference,
  Meal,
  MealHistory,
  GroceryList,
  Subscription,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (email: string, password: string, name?: string) => {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};

// Preferences API
export const preferencesAPI = {
  getPreferences: async () => {
    const response = await api.get<Record<string, Preference[]>>('/preferences');
    return response.data;
  },

  addPreference: async (type: string, value: string) => {
    const response = await api.post<Preference>('/preferences', {
      type,
      value,
    });
    return response.data;
  },

  deletePreference: async (id: string) => {
    await api.delete(`/preferences/${id}`);
  },
};

// Meals API
export const mealsAPI = {
  suggestMeal: async (excludeRecent?: boolean, maxPrepTime?: number) => {
    const response = await api.post<{ meal: Meal; historyId: string }>(
      '/meals/suggest',
      {
        excludeRecent,
        maxPrepTime,
      }
    );
    return response.data;
  },

  getMealHistory: async (limit?: number) => {
    const response = await api.get<MealHistory[]>('/meals/history', {
      params: { limit },
    });
    return response.data;
  },

  rateMeal: async (id: string, rating: number) => {
    const response = await api.post<MealHistory>(`/meals/history/${id}/rate`, {
      rating,
    });
    return response.data;
  },
};

// Grocery API
export const groceryAPI = {
  createGroceryList: async (mealIds: string[]) => {
    const response = await api.post<GroceryList>('/grocery', { mealIds });
    return response.data;
  },

  getGroceryLists: async () => {
    const response = await api.get<GroceryList[]>('/grocery');
    return response.data;
  },

  updateGroceryList: async (
    id: string,
    updates: { items?: any[]; completed?: boolean }
  ) => {
    const response = await api.put<GroceryList>(`/grocery/${id}`, updates);
    return response.data;
  },
};

// Subscription API
export const subscriptionAPI = {
  createCheckoutSession: async () => {
    const response = await api.post<{ sessionId: string; url: string }>(
      '/subscription/checkout'
    );
    return response.data;
  },

  getSubscriptionStatus: async () => {
    const response = await api.get<Subscription>('/subscription/status');
    return response.data;
  },
};
