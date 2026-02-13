import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedMeals = async () => {
  try {
    const existingMeals = await prisma.meal.count();
    
    if (existingMeals > 0) {
      console.log('Meals already seeded');
      return;
    }

    const meals = [
      {
        name: 'Chicken Stir Fry',
        description: 'Quick and healthy Asian-style chicken with colorful vegetables',
        ingredients: [
          'chicken breast',
          'bell peppers',
          'broccoli',
          'soy sauce',
          'garlic',
          'ginger',
          'rice',
          'sesame oil',
        ],
        cuisine: 'Asian',
        dietaryTags: ['gluten-free'],
        prepTime: 20,
      },
      {
        name: 'Vegetarian Pasta Primavera',
        description: 'Fresh pasta with seasonal vegetables in a light sauce',
        ingredients: [
          'pasta',
          'zucchini',
          'cherry tomatoes',
          'bell peppers',
          'garlic',
          'olive oil',
          'parmesan cheese',
          'basil',
        ],
        cuisine: 'Italian',
        dietaryTags: ['vegetarian'],
        prepTime: 25,
      },
      {
        name: 'Salmon with Quinoa',
        description: 'Grilled salmon fillet served with fluffy quinoa and greens',
        ingredients: [
          'salmon',
          'quinoa',
          'spinach',
          'lemon',
          'olive oil',
          'garlic',
          'cherry tomatoes',
        ],
        cuisine: 'Mediterranean',
        dietaryTags: ['gluten-free', 'pescatarian'],
        prepTime: 30,
      },
      {
        name: 'Black Bean Tacos',
        description: 'Delicious vegetarian tacos with seasoned black beans',
        ingredients: [
          'black beans',
          'corn tortillas',
          'avocado',
          'lettuce',
          'tomatoes',
          'cheese',
          'lime',
          'cilantro',
        ],
        cuisine: 'Mexican',
        dietaryTags: ['vegetarian', 'gluten-free'],
        prepTime: 15,
      },
      {
        name: 'Thai Green Curry',
        description: 'Aromatic coconut curry with vegetables and your choice of protein',
        ingredients: [
          'coconut milk',
          'green curry paste',
          'chicken',
          'bell peppers',
          'bamboo shoots',
          'thai basil',
          'fish sauce',
          'rice',
        ],
        cuisine: 'Thai',
        dietaryTags: ['gluten-free'],
        prepTime: 25,
      },
      {
        name: 'Greek Salad Bowl',
        description: 'Fresh Mediterranean salad with feta and olives',
        ingredients: [
          'cucumber',
          'tomatoes',
          'red onion',
          'feta cheese',
          'kalamata olives',
          'olive oil',
          'oregano',
          'lemon',
        ],
        cuisine: 'Greek',
        dietaryTags: ['vegetarian', 'gluten-free'],
        prepTime: 15,
      },
      {
        name: 'Beef Burrito Bowl',
        description: 'Hearty bowl with seasoned beef, rice, and all the fixings',
        ingredients: [
          'ground beef',
          'rice',
          'black beans',
          'corn',
          'lettuce',
          'tomatoes',
          'sour cream',
          'cheese',
          'salsa',
        ],
        cuisine: 'Mexican',
        dietaryTags: ['gluten-free'],
        prepTime: 30,
      },
      {
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza with fresh mozzarella and basil',
        ingredients: [
          'pizza dough',
          'tomato sauce',
          'fresh mozzarella',
          'basil',
          'olive oil',
          'garlic',
        ],
        cuisine: 'Italian',
        dietaryTags: ['vegetarian'],
        prepTime: 20,
      },
      {
        name: 'Teriyaki Tofu Bowl',
        description: 'Plant-based bowl with crispy tofu in homemade teriyaki sauce',
        ingredients: [
          'tofu',
          'soy sauce',
          'rice',
          'broccoli',
          'carrots',
          'sesame seeds',
          'ginger',
          'garlic',
        ],
        cuisine: 'Asian',
        dietaryTags: ['vegan', 'vegetarian'],
        prepTime: 20,
      },
      {
        name: 'Caesar Salad with Shrimp',
        description: 'Classic Caesar salad topped with grilled shrimp',
        ingredients: [
          'romaine lettuce',
          'shrimp',
          'parmesan cheese',
          'croutons',
          'caesar dressing',
          'lemon',
          'garlic',
        ],
        cuisine: 'American',
        dietaryTags: ['pescatarian'],
        prepTime: 15,
      },
      {
        name: 'Mushroom Risotto',
        description: 'Creamy Italian risotto with mixed mushrooms',
        ingredients: [
          'arborio rice',
          'mushrooms',
          'parmesan cheese',
          'white wine',
          'butter',
          'onion',
          'garlic',
          'vegetable stock',
        ],
        cuisine: 'Italian',
        dietaryTags: ['vegetarian', 'gluten-free'],
        prepTime: 35,
      },
      {
        name: 'Veggie Burger',
        description: 'Delicious plant-based burger with all the toppings',
        ingredients: [
          'veggie patty',
          'burger bun',
          'lettuce',
          'tomato',
          'onion',
          'pickles',
          'vegan mayo',
          'ketchup',
        ],
        cuisine: 'American',
        dietaryTags: ['vegetarian', 'vegan'],
        prepTime: 20,
      },
    ];

    await prisma.meal.createMany({
      data: meals,
    });

    console.log('Successfully seeded 12 meals');
  } catch (error) {
    console.error('Seed meals error:', error);
  }
};
