'use strict';

function ingredientModel(sequelize, DataTypes) {
  return sequelize.define('Ingredient', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
}

module.exports = ingredientModel;