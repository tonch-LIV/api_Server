'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const foodModel = require('./food.js');
const ingredientModel = require('./ingredients.js');

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
const Ingredient = ingredientModel(sequelize, DataTypes);

Food.hasMany(Ingredient, {  // matches Food's `id` against ingredients `foodId`
  foreignKey: 'foodId',
  sourceKey: 'id',  // parent column used by `.hasMany`
  as: 'ingredients',
});

Ingredient.belongsTo(Food, {  // Ingredient's `foodId` points to Food's `id`.
  foreignKey: 'foodId',  // child table column
  targetKey: 'id',  //  parent column targeted by `.belongsTo`
  as: 'food',
});

module.exports = {
  db: sequelize,
  Food,
  Ingredient,
};