'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var ingredienteSchema = Schema({
    Nombre: {
        type: String,
        require: true
    },

    Origen: {
        type: String,
        require: true
    },


    Categoria: {
        type: Schema.ObjectId,
        ref: 'Categoria',
        required: false
    }


});

module.exports = mongoose.model('Ingrediente', ingredienteSchema);