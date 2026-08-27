'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const foodModel = require('./food.js');
const clothesModel = require('./clothes.js');

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite::memory:'
  : process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
});

const Food = foodModel(sequelize, DataTypes);
const Clothes = clothesModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  Food,
  Clothes,
};