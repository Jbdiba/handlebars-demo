const db = require('../db');
const { DataTypes, Model } = require('sequelize');
class Restaurant extends Model {}

Restaurant.init({
    name: DataTypes.STRING,
        
    image:  DataTypes.STRING,
        
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    sequelize: db,
    timestamps: false,
});

module.exports = Restaurant;