'use strict'

var mongoose = require('../database/Mongoose Connection');
var Schema = mongoose.Schema;

var ingredientexrecetaSchema = Schema({
    Ingrediente: {
        type: Schema.ObjectId,
        ref: 'Ingrediente',
        require: true
    },

    Cantidad: {
        type: Number,
        require: true
    },

    Unidad: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('IngredienteXReceta', ingredientexrecetaSchema);