'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Usuarios extends Model {
		static associate(models) {
			
		}
  	}
	Usuarios.init({
    	email: DataTypes.STRING,
    	password: DataTypes.STRING
  	}, 
	{
    	sequelize,
    	modelName: 'usuarios',
  	});
  	return Usuarios;
};