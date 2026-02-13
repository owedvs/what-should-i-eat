export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Preference {
  id: string;
  userId: string;
  type: 'liked_food' | 'disliked_food' | 'dietary_restriction' | 'cuisine_preference';
  value: string;
  createdAt: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  cuisine: string;
  dietaryTags: string[];
  prepTime: number;
  createdAt: string;
}

export interface MealHistory {
  id: string;
  userId: string;
  mealId: string;
  meal: Meal;
  suggestedAt: string;
  rating: number | null;
}

export interface GroceryItem {
  name: string;
  checked: boolean;
}

export interface GroceryList {
  id: string;
  userId: string;
  items: GroceryItem[];
  createdAt: string;
  completed: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  status: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
