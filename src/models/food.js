'use strict';

function foodModel(sequelize, DataTypes) {
  return sequelize.define('Food', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}

module.exports = foodModel;