'use strict';

const express = require('express');

const { Clothes } = require('../models/index.js');

const router = express.Router();

router.post('/clothes', createClothes);

router.get('/clothes', getAllClothes);
router.get('/clothes/:id', getOneClothes);

router.put('/clothes/:id', updateClothes);
router.delete('/clothes/:id', deleteClothes);

async function createClothes(req, res, next) {
  try {
    const clothesData = selectClothesFields(req.body);
    const record = await Clothes.create(clothesData);

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

async function getAllClothes(req, res, next) {
  try {
    const records = await Clothes.findAll();

    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
}

async function getOneClothes(req, res, next) {
  try {
    const record = await Clothes.findByPk(req.params.id);

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

async function updateClothes(req, res, next) {
  try {
    const record = await Clothes.findByPk(req.params.id);
    const clothesData = selectClothesFields(req.body);
    const updatedRecord = await record.update(clothesData);

    res.status(200).json(updatedRecord);
  } catch (error) {
    next(error);
  }
}

async function deleteClothes(req, res, next) {
  try {
    await Clothes.destroy({
      where: {
        id: req.params.id,
      },
    });

    const deletedRecord = await Clothes.findByPk(req.params.id);

    res.status(200).json(deletedRecord);
  } catch (error) {
    next(error);
  }
}

function selectClothesFields(body) {
  const fields = {};

  if (Object.hasOwn(body, 'name')) {
    fields.name = body.name;
  }

  if (Object.hasOwn(body, 'color')) {
    fields.color = body.color;
  }

  if (Object.hasOwn(body, 'size')) {
    fields.size = body.size;
  }

  return fields;
}

module.exports = router; 