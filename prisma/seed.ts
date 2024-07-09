// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';


// initialize Prisma Client
const prisma = new PrismaClient();
const roundsOfHashing = 10;


async function main() {

    // create two dummy users
    const passwordSabin = await bcrypt.hash('password-sabin', roundsOfHashing);
    const passwordAlex = await bcrypt.hash('password-alex', roundsOfHashing);
  
    // create two dummy users
    const user1 = await prisma.user.upsert({
      where: { email: 'sabin@adams.com' },
      update: {
        password: passwordSabin,
      },
        create: {
        email: 'sabin@adams.com',
        name: 'Sabin Adams',
        password: passwordSabin,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'alex@ruheni.com' },
      update: {
        password: passwordAlex,
      },
        create: {
        email: 'alex@ruheni.com',
        name: 'Alex Ruheni',
        password: passwordAlex,
      },
    });
  

  // Seed categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'veg' },
      { name: 'non-veg' },
    ],
    skipDuplicates: true, // Avoid inserting duplicates
  });

  console.log('Categories seeded:', categories);

  // Get category IDs for mapping
  const vegCategory = await prisma.category.findFirst({ where: { name: 'veg' } });
  const nonVegCategory = await prisma.category.findFirst({ where: { name: 'non-veg' } });

  // Seed products
  const products = await prisma.product.createMany({
    data: [
      // Veg
      { name: 'Paneer Butter Masala', price: 8.50, categoryId: vegCategory!.id },
      { name: 'Vegetable Biryani', price: 10.00, categoryId: vegCategory!.id },
      { name: 'Aloo Gobi', price: 7.00, categoryId: vegCategory!.id },
      { name: 'Mixed Veg Curry', price: 9.00, categoryId: vegCategory!.id },
      { name: 'Chana Masala', price: 6.50, categoryId: vegCategory!.id },
      // Non-veg
      { name: 'Chicken Curry', price: 12.00, categoryId: nonVegCategory!.id },
      { name: 'Mutton Biryani', price: 15.00, categoryId: nonVegCategory!.id },
      { name: 'Fish Fry', price: 10.50, categoryId: nonVegCategory!.id },
      { name: 'Butter Chicken', price: 13.00, categoryId: nonVegCategory!.id },
      { name: 'Prawn Masala', price: 14.00, categoryId: nonVegCategory!.id },
    ],
    skipDuplicates: true, // Avoid inserting duplicates
  });

  console.log('Products seeded:', products);


  // create two dummy recipes
  const recipe1 = await prisma.recipe.upsert({
    where: { title: 'Spaghetti Bolognese' },
    update: {},
    create: {
      title: 'Spaghetti Bolognese',
      description: 'A classic Italian dish',
      ingredients:
        'Spaghetti, minced beef, tomato sauce, onions, garlic, olive oil, salt, pepper',
      instructions:
        '1. Cook the spaghetti. 2. Fry the minced beef. 3.Add the tomato sauce to the beef.4. Serve the spaghetti with the sauce.'
    }
  });

  const recipe2 = await prisma.recipe.upsert({
    where: { title: 'Chicken Curry' },
    update: {},
    create: {
      title: 'Chicken Curry',
      description: 'A spicy Indian dish',
      ingredients:
        'Chicken, curry powder, onions, garlic, coconut milk, olive oil, salt, pepper',
      instructions:
        '1. Fry the chicken. 2. Add the curry powder to the chicken. 3. Add the coconut milk. 4. Serve the curry with rice.'
    }
  });

  console.log({ recipe1, recipe2 });
}

// execute the main function
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
