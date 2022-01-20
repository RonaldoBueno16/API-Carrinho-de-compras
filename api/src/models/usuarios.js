'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class usuarios extends Model {
		static associate(models) {
			
		}
  	}
	usuarios.init({
    	email: DataTypes.STRING,
    	password: DataTypes.STRING
  	}, 
	{
    	sequelize,
    	modelName: 'usuarios',
  	});
  	return usuarios;
};