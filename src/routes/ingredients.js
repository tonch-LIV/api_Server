'use strict';

const express = require('express');

const Collection = require('../models/collection-class.js');
const { Ingredient } = require('../models/index.js');

const router = express.Router();
const ingredientCollection = new Collection(Ingredient);

router.post('/ingredients', createIngredient);
router.get('/ingredients', getAllIngredients);
router.get('/ingredients/:id', getOneIngredient);
router.put('/ingredients/:id', updateIngredient);
router.delete('/ingredients/:id', deleteIngredient);

async function createIngredient(req, res, next) {
  try {
    const ingredientData = selectIngredientFields(req.body);
    const record = await ingredientCollection.create(ingredientData);

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

async function getAllIngredients(req, res, next) {
  try {
    const records = await ingredientCollection.read();
    const response = records.map(addFoodLink);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function getOneIngredient(req, res, next) {
  try {
    const record = await ingredientCollection.read(req.params.id);

    res.status(200).json(addFoodLink(record));
  } catch (error) {
    next(error);
  }
}

async function updateIngredient(req, res, next) {
  try {
    const ingredientData = selectIngredientFields(req.body);
    const updatedRecord = await ingredientCollection.update(
      req.params.id,
      ingredientData,
    );

    res.status(200).json(addFoodLink(updatedRecord));
  } catch (error) {
    next(error);
  }
}

async function deleteIngredient(req, res, next) {
  try {
    const deletedRecord = await ingredientCollection.delete(req.params.id);

    res.status(200).json(deletedRecord);
  } catch (error) {
    next(error);
  }
}

function selectIngredientFields(body) {
  const fields = {};

  if (Object.hasOwn(body, 'name')) {
    fields.name = body.name;
  }

  if (Object.hasOwn(body, 'amount')) {
    fields.amount = body.amount;
  }

  if (Object.hasOwn(body, 'foodId')) {
    fields.foodId = body.foodId;
  }

  return fields;
}

function addFoodLink(record) {
  if (!record) {
    return null;
  }

  const ingredient = record.toJSON();

  return {
    ...ingredient,
    food: `/food/${ingredient.foodId}`,
  };
}

module.exports = router;