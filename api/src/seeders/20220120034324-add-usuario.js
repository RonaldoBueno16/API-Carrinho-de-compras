'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('usuarios', [
            {
                email: 'andremerli74@gmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'zxhbpg@jmurip.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'pmlxew@veracg.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'cgbvud@lxvhhq.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'carmed@usp.br',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'caueameni@gmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'claudiomsi@hotmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'daisyess@gmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'abr@hotmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'deuzimarcorreiadesantana@gmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'dfqjjd@fettiv.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'gregb@hotmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'ucmnyo@afyyrn.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'itaperuna@gmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'edw_drum@hotmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'etechy@tre-pr.jus.br',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'fabiosilvarodolpho@gmail.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'feliperepresentante@yahoo.com.br',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'financeiro@Yahoo.com.br',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'fernandopontes@outlook.com',
                password: '123',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('usuarios', [{
            
        }], {});
    }
};
