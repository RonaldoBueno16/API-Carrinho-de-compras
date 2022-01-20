'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carrinhos_ativos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuarios_id: {
        type: Sequelize.INTEGER
      },
      quantidade_produtos: {
        type: Sequelize.INTEGER
      },
      valor_total: {
        type: Sequelize.DOUBLE
      },
      cupom_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('carrinhos_ativos');
  }
};