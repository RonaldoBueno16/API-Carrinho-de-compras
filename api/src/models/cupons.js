'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cupons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cupons.init({
    codigo: DataTypes.STRING,
    desconto: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'cupons',
  });
  return cupons;
};