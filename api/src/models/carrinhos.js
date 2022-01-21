

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
      carrinhos.hasMany(models.itens_carrinho, 
        {foreignKey: 'carrinhos_id', as: 'itens_carrinho'})

        //Associação de um para muitos - Um carrinho pode ter vários itens
        
    }
  }
  carrinhos.init({
    usuarios_id: DataTypes.INTEGER,
    num_produtos: DataTypes.INTEGER,
    total: DataTypes.DOUBLE,
    subtotal: DataTypes.DOUBLE,
    cupom: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'carrinhos',
  });
  return carrinhos;
};