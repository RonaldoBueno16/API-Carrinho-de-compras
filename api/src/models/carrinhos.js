'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carrinhos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  carrinhos.init({
    usuarios_id: DataTypes.INTEGER,
    num_produtos: DataTypes.INTEGER,
    total: DataTypes.DOUBLE,
    subtotal: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'carrinhos',
  });
  return carrinhos;
};