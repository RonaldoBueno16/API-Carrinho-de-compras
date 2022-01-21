'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('produtos', [
      {
        nome: 'Jaleco',
        descricao: 'Jaleco de alta qualidade para atender aos clientes mais exigentes',
        preco: Math.floor(Math.random() * (200 - 50) + 50), //Preço de R$50,00 à R$200,00
        estoque: Math.floor(Math.random() * (5 - 1) + 1), //Estoque de 1 à 5
        createdAt: new Date(),
        updatedAt: new Date(),
        disponivel: true
      },
      {
        nome: 'Camiseta Hurley',
        descricao: 'Camiseta azul com estampas amarelas',
        preco: Math.floor(Math.random() * (200 - 50) + 50), //Preço de R$50,00 à R$200,00
        estoque: Math.floor(Math.random() * (5 - 1) + 1), //Estoque de 1 à 5
        createdAt: new Date(),
        updatedAt: new Date(),
        disponivel: true
      },
      {
        nome: 'Jaqueta de couro',
        descricao: 'Jaqueta de couro para os dias frios de inverno',
        preco: Math.floor(Math.random() * (200 - 50) + 50), //Preço de R$50,00 à R$200,00
        estoque: Math.floor(Math.random() * (5 - 1) + 1), //Estoque de 1 à 5
        createdAt: new Date(),
        updatedAt: new Date(),
        disponivel: true
      },
      {
        nome: 'Calça Jeans',
        descricao: 'Calça jeans preta sem rasgos',
        preco: Math.floor(Math.random() * (200 - 50) + 50), //Preço de R$50,00 à R$200,00
        estoque: Math.floor(Math.random() * (5 - 1) + 1), //Estoque de 1 à 5
        createdAt: new Date(),
        updatedAt: new Date(),
        disponivel: true
      },
      {
        nome: 'Bonê Preto Oakle',
        descricao: 'Bonê preto da oakle para você andar com estilo',
        preco: Math.floor(Math.random() * (200 - 50) + 50), //Preço de R$50,00 à R$200,00
        estoque: Math.floor(Math.random() * (5 - 1) + 1), //Estoque de 1 à 5
        createdAt: new Date(),
        updatedAt: new Date(),
        disponivel: true
      },
      {
        nome: 'Terno azul slim',
        descricao: 'Terno social azul slim',
        preco: Math.floor(Math.random() * (600 - 300) + 300), //Preço de R$300,00 à R$600,00
        estoque: Math.floor(Math.random() * (3 - 1) + 1), //Estoque de 1 à 3
        createdAt: new Date(),
        updatedAt: new Date(),
        disponivel: true
      },
      {
        nome: 'Gravata',
        descricao: 'Gravata de seda 7,5 jacquard vermelha',
        preco: Math.floor(Math.random() * (150 - 80) + 80), 
        estoque: Math.floor(Math.random() * (3 - 1) + 1), //Estoque de 1 à 3
        createdAt: new Date(),
        updatedAt: new Date(),
        disponivel: true
      },
      {
        nome: 'Pijama',
        descricao: 'Conjunto de pijama feminino para um bom sono',
        preco: Math.floor(Math.random() * (150 - 80) + 80), 
        estoque: Math.floor(Math.random() * (3 - 1) + 1), //Estoque de 1 à 3
        createdAt: new Date(),
        updatedAt: new Date(),
        disponivel: true
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    
  }
};
