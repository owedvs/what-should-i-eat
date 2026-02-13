import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const meals = [
  {
    name: 'Chicken Stir Fry',
    description: 'A quick and healthy Asian-style stir fry with tender chicken and crisp vegetables',
    ingredients: [
      'Chicken breast',
      'Bell peppers',
      'Broccoli',
      'Carrots',
      'Soy sauce',
      'Garlic',
      'Ginger',
      'Sesame oil',
      'Rice',
    ],
    cuisine: 'Asian',
    dietaryTags: ['gluten-free-option', 'high-protein'],
    prepTime: 20,
  },
  {
    name: 'Vegetarian Pasta Primavera',
    description: 'Colorful pasta dish loaded with fresh seasonal vegetables',
    ingredients: [
      'Pasta',
      'Zucchini',
      'Cherry tomatoes',
      'Bell peppers',
      'Garlic',
      'Olive oil',
      'Parmesan cheese',
      'Basil',
      'Cream',
    ],
    cuisine: 'Italian',
    dietaryTags: ['vegetarian'],
    prepTime: 25,
  },
  {
    name: 'Salmon with Quinoa',
    description: 'Grilled salmon fillet served over fluffy quinoa with roasted vegetables',
    ingredients: [
      'Salmon fillet',
      'Quinoa',
      'Asparagus',
      'Lemon',
      'Olive oil',
      'Garlic',
      'Cherry tomatoes',
      'Dill',
    ],
    cuisine: 'Mediterranean',
    dietaryTags: ['gluten-free', 'high-protein'],
    prepTime: 30,
  },
  {
    name: 'Black Bean Tacos',
    description: 'Delicious and filling tacos with seasoned black beans and fresh toppings',
    ingredients: [
      'Black beans',
      'Corn tortillas',
      'Avocado',
      'Tomatoes',
      'Lettuce',
      'Lime',
      'Cilantro',
      'Cumin',
      'Onion',
    ],
    cuisine: 'Mexican',
    dietaryTags: ['vegetarian', 'vegan-option'],
    prepTime: 15,
  },
  {
    name: 'Thai Green Curry',
    description: 'Aromatic coconut curry with vegetables and Thai basil',
    ingredients: [
      'Coconut milk',
      'Green curry paste',
      'Tofu',
      'Bamboo shoots',
      'Thai basil',
      'Bell peppers',
      'Eggplant',
      'Jasmine rice',
      'Lime',
    ],
    cuisine: 'Thai',
    dietaryTags: ['vegan', 'gluten-free'],
    prepTime: 25,
  },
  {
    name: 'Greek Salad Bowl',
    description: 'Fresh Mediterranean salad with feta, olives, and grilled chicken',
    ingredients: [
      'Chicken breast',
      'Cucumbers',
      'Tomatoes',
      'Red onion',
      'Feta cheese',
      'Kalamata olives',
      'Olive oil',
      'Lemon',
      'Oregano',
    ],
    cuisine: 'Greek',
    dietaryTags: ['gluten-free', 'high-protein'],
    prepTime: 15,
  },
  {
    name: 'Beef Burrito Bowl',
    description: 'Hearty Mexican-style bowl with seasoned beef, rice, and toppings',
    ingredients: [
      'Ground beef',
      'Rice',
      'Black beans',
      'Corn',
      'Tomatoes',
      'Lettuce',
      'Sour cream',
      'Cheese',
      'Salsa',
      'Avocado',
    ],
    cuisine: 'Mexican',
    dietaryTags: ['gluten-free', 'high-protein'],
    prepTime: 30,
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
    ingredients: [
      'Pizza dough',
      'Tomato sauce',
      'Fresh mozzarella',
      'Fresh basil',
      'Olive oil',
      'Garlic',
      'Salt',
    ],
    cuisine: 'Italian',
    dietaryTags: ['vegetarian'],
    prepTime: 20,
  },
  {
    name: 'Teriyaki Tofu Bowl',
    description: 'Crispy tofu glazed with teriyaki sauce over rice with vegetables',
    ingredients: [
      'Firm tofu',
      'Teriyaki sauce',
      'Rice',
      'Broccoli',
      'Carrots',
      'Sesame seeds',
      'Green onions',
      'Ginger',
    ],
    cuisine: 'Asian',
    dietaryTags: ['vegan', 'vegetarian'],
    prepTime: 20,
  },
  {
    name: 'Caesar Salad with Grilled Shrimp',
    description: 'Classic Caesar salad topped with perfectly grilled shrimp',
    ingredients: [
      'Shrimp',
      'Romaine lettuce',
      'Croutons',
      'Parmesan cheese',
      'Caesar dressing',
      'Lemon',
      'Black pepper',
      'Garlic',
    ],
    cuisine: 'American',
    dietaryTags: ['high-protein'],
    prepTime: 15,
  },
  {
    name: 'Mushroom Risotto',
    description: 'Creamy Italian rice dish with earthy mushrooms and parmesan',
    ingredients: [
      'Arborio rice',
      'Mushrooms',
      'Vegetable broth',
      'White wine',
      'Parmesan cheese',
      'Butter',
      'Onion',
      'Garlic',
      'Thyme',
    ],
    cuisine: 'Italian',
    dietaryTags: ['vegetarian', 'gluten-free'],
    prepTime: 35,
  },
  {
    name: 'Spicy Korean Bibimbap',
    description: 'Colorful rice bowl with vegetables, egg, and gochujang sauce',
    ingredients: [
      'Rice',
      'Beef',
      'Spinach',
      'Bean sprouts',
      'Carrots',
      'Egg',
      'Gochujang',
      'Sesame oil',
      'Kimchi',
    ],
    cuisine: 'Asian',
    dietaryTags: ['high-protein'],
    prepTime: 30,
  },
];

export const seedDatabase = async (): Promise<void> => {
  try {
    const existingMeals = await prisma.meal.count();

    if (existingMeals === 0) {
      console.log('Seeding database with meals...');
      await prisma.meal.createMany({
        data: meals,
      });
      console.log(`Successfully seeded ${meals.length} meals`);
    } else {
      console.log('Database already contains meals, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
