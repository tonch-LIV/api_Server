'use strict';

const supertest = require('supertest');

const { app } = require('../src/server.js');
const { db, Food, Clothes } = require('../src/models/index.js');

const request = supertest(app);

const foodData = {
  name: 'apple',
  calories: 95,
  type: 'fruit',
};

const clothesData = {
  name: 'shirt',
  color: 'blue',
  size: 'medium',
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

  test('returns 500 when model valiadation fails', async () => {
    const response = await request.post('/food').send({
      name: 'incomplete food',
    });

    expect(response.status).toEqual(500);
    expect(response.body.error).toEqual;
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
    expect(response.body.name).toEqual('apple');
    expect(response.body.calories).toEqual(95);
    expect(response.body.type).toEqual('fruit');
    expect(response.body.admin).toBeUndefined();
  });

  test('reads all food records', async () => {
    await Food.create(foodData);

    const response = await request.get('/food');

    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toEqual('apple');
  });

  test('reads one food record', async () => {
    const food = await Food.create(foodData);

    const response = await request.get(`/food/${food.id}`);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(food.id);
    expect(response.body.name).toEqual('apple');
  });

  test('updates a food record', async () => {
    const food = await Food.create(foodData);

    const response = await request.put(`/food/${food.id}`).send({
      name: 'banana',
      admin: true,
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('banana');
    expect(response.body.calories).toEqual(95);
    expect(response.body.admin).toBeUndefined();
  });

  test('deletes a food record', async () => {
    const food = await Food.create(foodData);

    const response = await request.delete(`/food/${food.id}`);
    const deletedFood = await Food.findByPk(food.id);

    expect(response.status).toEqual(200);
    expect(response.body).toBeNull();
    expect(deletedFood).toBeNull();
  });
});

describe('Clothes routes', () => {
  test('creates a clothes record', async () => {
    const response = await request.post('/clothes').send({
      ...clothesData,
      admin: true,
    });

    expect(response.status).toEqual(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual('shirt');
    expect(response.body.color).toEqual('blue');
    expect(response.body.size).toEqual('medium');
    expect(response.body.admin).toBeUndefined();
  });

  test('reads all clothes records', async () => {
    await Clothes.create(clothesData);

    const response = await request.get('/clothes');

    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toEqual('shirt');
  });

  test('reads one clothes record', async () => {
    const clothes = await Clothes.create(clothesData);

    const response = await request.get(`/clothes/${clothes.id}`);

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(clothes.id);
    expect(response.body.name).toEqual('shirt');
  });

  test('updates a clothes record', async () => {
    const clothes = await Clothes.create(clothesData);

    const response = await request.put(`/clothes/${clothes.id}`).send({
      color: 'green',
      admin: true,
    });

    expect(response.status).toEqual(200);
    expect(response.body.color).toEqual('green');
    expect(response.body.size).toEqual('medium');
    expect(response.body.admin).toBeUndefined();
  });

  test('deletes a clothes record', async () => {
    const clothes = await Clothes.create(clothesData);

    const response = await request.delete(`/clothes/${clothes.id}`);
    const deletedClothes = await Clothes.findByPk(clothes.id);

    expect(response.status).toEqual(200);
    expect(response.body).toBeNull();
    expect(deletedClothes).toBeNull();
  });
});