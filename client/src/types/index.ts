export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Preference {
  id: string;
  type: string;
  value: string;
  createdAt: Date;
}

export interface Meal {
  id: string;
  name: string;
  description?: string;
  ingredients: string[];
  cuisine?: string;
  dietaryTags: string[];
  prepTime?: number;
  createdAt: Date;
}

export interface MealHistory {
  id: string;
  userId: string;
  mealId: string;
  meal: Meal;
  suggestedAt: Date;
  rating?: number;
}

export interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

export interface GroceryList {
  id: string;
  userId: string;
  items: GroceryItem[];
  completed: boolean;
  createdAt: Date;
}

export interface Subscription {
  status: string;
  active: boolean;
  currentPeriodEnd?: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}
