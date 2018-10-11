'use strict'

var mongoose = require('../database/Mongoose Connection');
var Schema = mongoose.Schema;

var menuSchema = Schema({
    Usuario: {
        type: Schema.ObjectId,
        ref: 'Usuario',
        require: true
    },

    Fecha: {
        type: Date,
        require: true
    },

    Recetas: [{
        type: Schema.ObjectId,
        ref: 'RecetaSugerida',
        require: false
    }],

    Valores: [{
        type: Schema.ObjectId,
        ref: 'ValoresNutricionalesXMenu',
        require: false
    }],

    Calorias: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('Menu', menuSchema);