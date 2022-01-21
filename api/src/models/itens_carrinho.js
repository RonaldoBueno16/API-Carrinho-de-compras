'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class itens_carrinho extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      itens_carrinho.belongsTo(models.carrinhos, {foreignKey: 'id', as: 'carrinho'});
      itens_carrinho.hasMany(models.produtos, {foreignKey: 'id', as: 'itens_carrinho_produtos'});

      //Vários itens de carrinho pertence à um carrinho
    }
  }
  itens_carrinho.init({
    carrinhos_id: DataTypes.INTEGER,
    produtos_id: DataTypes.INTEGER,
    quantidade: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'itens_carrinho',
  });
  return itens_carrinho;
};