'use strict';

const express = require('express');

const Collection = require('../models/collection-class.js');
const { Food, Ingredient } = require('../models/index.js');

const router = express.Router();
const foodCollection = new Collection(Food);

router.post('/food', createFood);

router.get('/food', getAllFood);
router.get('/food/:id/ingredients', getFoodWithIngredients);
router.get('/food/:id', getOneFood);

router.put('/food/:id', updateFood);

router.delete('/food/:id', deleteFood);

async function createFood(req, res, next) {
  try {
    const foodData = selectFoodFields(req.body);
    const record = await foodCollection.create(foodData);

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

async function getAllFood(req, res, next) {
  try {
    const records = await foodCollection.read();
    const response = records.map(addIngredientsLink);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function getOneFood(req, res, next) {
  try {
    const record = await foodCollection.read(req.params.id);

    res.status(200).json(addIngredientsLink(record));
  } catch (error) {
    next(error);
  }
}

async function getFoodWithIngredients(req, res, next) {
  try {
    const record = await foodCollection.read(req.params.id, {
      include: {
        model: Ingredient,
        as: 'ingredients',
      },
    });

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

async function updateFood(req, res, next) {
  try {
    const foodData = selectFoodFields(req.body);
    const record = await foodCollection.update(
      req.params.id,
      foodData,
    );
    
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

async function deleteFood(req, res, next) {
  try {
    const record = await foodCollection.delete(req.params.id);

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

function selectFoodFields(body) {
  const fields = {};

  if (Object.hasOwn(body, 'name')) {
    fields.name = body.name;
  }

  if (Object.hasOwn(body, 'calories')) {
    fields.calories = body.calories;
  }

  if (Object.hasOwn(body, 'type')) {
    fields.type = body.type;
  }

  return fields;
}

function addIngredientsLink(record) {
  if (!record) {
    return null;
  }

  const food = record.toJSON();

  return {
    ...food,
    ingredients: `/food/${food.id}/ingredients`,
  };
}

module.exports = router;