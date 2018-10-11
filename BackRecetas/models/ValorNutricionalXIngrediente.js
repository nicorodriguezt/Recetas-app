'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var valorNutricionalXIngredienteSchema = Schema({
    CandtidadContenida: {
        type: Number,
        require: true
    },

    Porcion: {
        type: Number,
        require: true
    },

    Ingrediente: {
        type: Schema.ObjectId,
        ref: 'Ingrediente',
        required: true
    },

    ValorNutricional: {
        type: Schema.ObjectId,
        ref: 'ValorNutricional',
        required: true
    },

    Unidad: {
        type: String,
        required: true
    },

    UnidadPorcion: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('ValorNutricionalXIngrediente', valorNutricionalXIngredienteSchema);