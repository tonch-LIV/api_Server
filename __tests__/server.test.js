'use strict';

const supertest = require('supertest');

const { app } = require('../src/server.js');
const {
  db,
  Food,
  Ingredient,
} = require('../src/models/index.js');

const request = supertest(app);

const foodData = {
  name: 'pizza',
  calories: 800,
  type: 'meal',
};

beforeAll(async () => {
  await db.sync();
});

beforeEach(async () => {
  await db.sync({
    force: true,
  });
});

afterAll(async () => {
  await db.close();
});

describe('Error responses', () => {
  test('returns 404 for an unknown route', async () => {
    const response = await request.get('/missing');

    expect(response.status).toEqual(404);
  });

  test('returns 404 for an unsupported method', async () => {
    const response = await request.patch('/food');

    expect(response.status).toEqual(404);
  });

  test('returns 500 when model validation fails', async () => {
    const response = await request.post('/food').send({
      name: 'incomplete food',
    });

    expect(response.status).toEqual(500);
    expect(response.body.error).toEqual(500);
  });
});

describe('Food routes', () => {
  test('creates a food record', async () => {
    const response = await request.post('/food').send({
      ...foodData,
      admin: true,
    });

    expect(response.status).toEqual(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual('pizza');
    expect(response.body.calories).toEqual(800);
    expect(response.body.type).toEqual('meal');
    expect(response.body.admin).toBeUndefined();
  });

  test('reads all food records with association links', async () => {
    const food = await Food.create(foodData);

    const response = await request.get('/food');

    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toEqual('pizza');
    expect(response.body[0].ingredients)
      .toEqual(`/food/${food.id}/ingredients`);
  });

  test('reads one food record with an association link', async () => {
    const food = await Food.create(foodData);

    const response = await request.get(`/food/${food.id}`);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(food.id);
    expect(response.body.name).toEqual('pizza');
    expect(response.body.ingredients)
      .toEqual(`/food/${food.id}/ingredients`);
  });

  test('updates a food record through the Collection', async () => {
    const food = await Food.create(foodData);

    const response = await request.put(`/food/${food.id}`).send({
      name: 'vegetable pizza',
      admin: true,
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('vegetable pizza');
    expect(response.body.calories).toEqual(800);
    expect(response.body.admin).toBeUndefined();
  });

  test('deletes a food record through the Collection', async () => {
    const food = await Food.create(foodData);

    const response = await request.delete(`/food/${food.id}`);
    const deletedFood = await Food.findByPk(food.id);

    expect(response.status).toEqual(200);
    expect(response.body).toBeNull();
    expect(deletedFood).toBeNull();
  });
});

describe('Ingredient routes', () => {
  test('creates an ingredient record', async () => {
    const food = await Food.create(foodData);

    const response = await request.post('/ingredients').send({
      name: 'cheese',
      amount: '2 cups',
      foodId: food.id,
      admin: true,
    });

    expect(response.status).toEqual(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual('cheese');
    expect(response.body.amount).toEqual('2 cups');
    expect(response.body.foodId).toEqual(food.id);
    expect(response.body.admin).toBeUndefined();
  });

  test('reads all ingredients with parent links', async () => {
    const food = await Food.create(foodData);

    await Ingredient.create({
      name: 'cheese',
      amount: '2 cups',
      foodId: food.id,
    });

    const response = await request.get('/ingredients');

    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toEqual('cheese');
    expect(response.body[0].food).toEqual(`/food/${food.id}`);
  });

  test('reads one ingredient with its parent link', async () => {
    const food = await Food.create(foodData);

    const ingredient = await Ingredient.create({
      name: 'dough',
      amount: '1 pound',
      foodId: food.id,
    });

    const response = await request.get(
      `/ingredients/${ingredient.id}`,
    );

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(ingredient.id);
    expect(response.body.food).toEqual(`/food/${food.id}`);
  });

  test('updates an ingredient through the Collection', async () => {
    const food = await Food.create(foodData);

    const ingredient = await Ingredient.create({
      name: 'cheese',
      amount: '2 cups',
      foodId: food.id,
    });

    const response = await request
      .put(`/ingredients/${ingredient.id}`)
      .send({
        amount: '3 cups',
        admin: true,
      });

    expect(response.status).toEqual(200);
    expect(response.body.amount).toEqual('3 cups');
    expect(response.body.name).toEqual('cheese');
    expect(response.body.admin).toBeUndefined();
  });

  test('deletes an ingredient through the Collection', async () => {
    const food = await Food.create(foodData);

    const ingredient = await Ingredient.create({
      name: 'cheese',
      amount: '2 cups',
      foodId: food.id,
    });

    const response = await request.delete(
      `/ingredients/${ingredient.id}`,
    );

    const deletedIngredient = await Ingredient.findByPk(
      ingredient.id,
    );

    expect(response.status).toEqual(200);
    expect(response.body).toBeNull();
    expect(deletedIngredient).toBeNull();
  });
});

describe('Food and Ingredient association', () => {
  test('returns a food record with all related ingredients', async () => {
    const food = await Food.create(foodData);

    await Ingredient.bulkCreate([
      {
        name: 'dough',
        amount: '1 pound',
        foodId: food.id,
      },
      {
        name: 'cheese',
        amount: '2 cups',
        foodId: food.id,
      },
    ]);

    const response = await request.get(
      `/food/${food.id}/ingredients`,
    );

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(food.id);
    expect(response.body.ingredients).toHaveLength(2);
    expect(response.body.ingredients[0].foodId).toEqual(food.id);
    expect(response.body.ingredients[1].foodId).toEqual(food.id);
  });
});