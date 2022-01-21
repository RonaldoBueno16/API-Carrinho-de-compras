'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('cupons', [
      {
        codigo: 'EXTRAGOOD',
        desconto: 0.05
      },
      {
        codigo: '20PORCENTO',
        desconto: 0.2
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
