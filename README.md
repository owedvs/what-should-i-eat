# 🍽️ What Should I Eat?

A full-stack subscription-based meal suggestion app that helps you decide what to eat based on your preferences.

## 📖 Description

Tired of decision fatigue when it comes to meal planning? "What Should I Eat?" is your daily companion that suggests personalized meals based on your preferences, dietary restrictions, and cuisine favorites. For just $4/month, get unlimited meal suggestions, track your meal history, and generate grocery lists.

## ✨ Features

- **Smart Meal Suggestions**: Get personalized meal recommendations based on your preferences
- **Preference Management**: Set liked foods, disliked foods, dietary restrictions, and cuisine preferences
- **Meal History Tracking**: View your recent meal suggestions
- **Flexible Filters**: Exclude recent meals and filter by prep time
- **Subscription Management**: Stripe-powered $4/month subscription
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Beautiful UI**: Modern gradient design with orange and yellow theme

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database management
- **JWT** for authentication
- **Stripe** for payment processing
- **Zod** for input validation

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Axios** for API calls

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Stripe account (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/owedvs/what-should-i-eat.git
   cd what-should-i-eat
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Setup PostgreSQL database**
   - Create a new PostgreSQL database named `whatshouldieat`
   - Note your database connection URL

5. **Configure server environment**
   ```bash
   cd ../server
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your values:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/whatshouldieat?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   CLIENT_URL="http://localhost:5173"
   PORT=3000
   ```

6. **Configure client environment**
   ```bash
   cd ../client
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

7. **Run database migrations**
   ```bash
   cd ../server
   npx prisma migrate dev --name init
   ```

8. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

9. **Start the development servers**

   In one terminal (server):
   ```bash
   cd server
   npm run dev
   ```

   In another terminal (client):
   ```bash
   cd client
   npm run dev
   ```

10. **Open your browser**
    Navigate to `http://localhost:5173`

## 📁 Project Structure

```
what-should-i-eat/
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── preferencesController.ts
│   │   │   ├── mealsController.ts
│   │   │   ├── groceryController.ts
│   │   │   └── subscriptionController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── seedService.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Preferences.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── stores/
│   │   │   └── authStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Preferences (Protected)
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Add preference
- `DELETE /api/preferences/:id` - Delete preference

### Meals (Protected)
- `GET /api/meals/suggest` - Get meal suggestion
- `GET /api/meals/history` - Get meal history
- `PATCH /api/meals/history/:historyId/rate` - Rate a meal

### Grocery Lists (Protected)
- `POST /api/grocery-lists` - Create grocery list
- `GET /api/grocery-lists` - Get grocery lists
- `PATCH /api/grocery-lists/:id` - Update grocery list

### Subscription (Protected)
- `POST /api/subscription/checkout` - Create Stripe checkout session
- `GET /api/subscription/status` - Get subscription status

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## 💳 Subscription Features

For $4/month, subscribers get:
- Unlimited meal suggestions
- Smart filtering based on preferences
- Meal history tracking
- Grocery list generation
- Regular database updates with new meals

## 🧪 Smart Meal Suggestion Algorithm

The algorithm:
1. Fetches user preferences (liked/disliked foods, dietary restrictions, cuisines)
2. Gets recent meal history (last 7 days) if excludeRecent is enabled
3. Filters meals by dietary requirements
4. Excludes meals with disliked ingredients
5. Scores meals based on liked ingredients
6. Randomly selects from top 10 matches
7. Saves to history and returns the suggestion

## 📝 License

MIT License - feel free to use this project for learning or personal use!