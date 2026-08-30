'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const foodModel = require('./food.js');
const clothesModel = require('./clothes.js');

let sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
  });
}

const Food = foodModel(sequelize, DataTypes);
const Clothes = clothesModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  Food,
  Clothes,
};