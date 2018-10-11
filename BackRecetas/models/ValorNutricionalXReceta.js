'use strict'

var mongoose = require('../database/Mongoose Connection');
var Schema = mongoose.Schema;

var ValorNutricionalXRecetaSchema = Schema({
    ValorNutricional: {
        type: Schema.ObjectId,
        ref: 'ValorNutricional',
        require: true
    },

    Cantidad: {
        type: Number,
        require: true
    },

    Unidad:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('ValorNutricionalXReceta', ValorNutricionalXRecetaSchema);