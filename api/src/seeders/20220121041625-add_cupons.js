'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('cupons', [
      {
        codigo: 'EXTRAGOOD',
        desconto: 0.05,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        codigo: '20PORCENTO',
        desconto: 0.2,
        createdAt: new Date(),
        updatedAt: new Date()
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
