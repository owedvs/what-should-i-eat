import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
