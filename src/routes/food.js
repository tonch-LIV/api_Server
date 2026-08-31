'use strict';

const express = require('express');

const { Food } = require('../models/index.js');

const router = express.Router();

router.post('/food', createFood);

router.get('/food', getAllFood);
router.get('/food/:id', getOneFood);

router.put('/food/:id', updateFood);

router.delete('/food/:id', deleteFood);

async function createFood(req, res, next) {
  try {
    const foodData = selectFoodFields(req.body);
    const record = await Food.create(foodData);

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

async function getAllFood(req, res, next) {
  try {
    const records = await Food.findAll();

    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
}

async function getOneFood(req, res, next) {
  try {
    const record = await Food.findByPk(req.params.id);

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

async function updateFood(req, res, next) {
  try {
    const record = await Food.findByPk(req.params.id);
    const foodData = selectFoodFields(req.body);
    const updatedRecord = await record.update(foodData);

    res.status(200).json(updatedRecord);
  } catch (error) {
    next(error);
  }
}

async function deleteFood(req, res, next) {
  try {
    await Food.destroy({
      where: {
        id: req.params.id,
      },
    });

    const deletedRecord = await Food.findByPk(req.params.id);

    res.status(200).json(deletedRecord);
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

module.exports = router;