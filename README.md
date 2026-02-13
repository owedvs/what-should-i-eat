# What Should I Eat? 🍽️

A complete full-stack meal decision application to help you decide what to eat based on your preferences!

## Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- ⚙️ **Preferences Management** - Set dietary restrictions, allergies, cuisines, and ingredients
- 🍕 **Smart Meal Suggestions** - AI-powered algorithm that considers your preferences and history
- 📊 **Meal History** - Track and rate meals you've tried
- 🛒 **Grocery Lists** - Auto-generate shopping lists from meals
- 💳 **Premium Subscriptions** - Stripe integration for premium features
- 🎨 **Beautiful UI** - Modern orange/yellow gradient design with Tailwind CSS

## Tech Stack

### Backend (`/server`)
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe Payment Integration
- bcrypt for password hashing

### Frontend (`/client`)
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand (State Management)
- Axios

## Project Structure

```
what-should-i-eat/
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── index.html
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
- Database URL
- JWT secret
- Stripe keys (optional)

5. Run Prisma migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

Server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Client will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Preferences
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Add preference
- `DELETE /api/preferences/:id` - Delete preference

### Meals
- `GET /api/meals/suggest` - Get meal suggestion
- `GET /api/meals/history` - Get meal history
- `PATCH /api/meals/history/:historyId/rate` - Rate a meal

### Grocery Lists
- `POST /api/grocery-lists` - Create grocery list
- `GET /api/grocery-lists` - Get grocery lists
- `PATCH /api/grocery-lists/:id` - Update grocery list

### Subscriptions
- `POST /api/subscription/checkout` - Create checkout session
- `POST /api/webhooks/stripe` - Stripe webhook
- `GET /api/subscription/status` - Get subscription status

## Development

### Build for Production

Backend:
```bash
cd server
npm run build
npm start
```

Frontend:
```bash
cd client
npm run build
npm run preview
```

## License

MIT License