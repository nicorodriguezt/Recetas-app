'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var datosusuarioSchema = Schema({
    PesoAprox: {
        type: Number,
        require: true
    },

    Altura: {
        type: Number,
        require: true
    },

    Edad: {
        type: Number,
        require: true
    },

    Sexo: {
        type: String,
        require: true
    },

    ActividadLaboral: {
        type: Schema.ObjectId,
        ref: 'ActividadLaboral',
        required: false
    },

    IMC: {
        type: String,
        require: false
    },

    PesoTeorico: {
        type: Number,
        required: false
    },

    Usuario: {
        type: Schema.ObjectId,
        ref: 'Usuario',
        require: true,
        unique: true
    },

    Preferencias: [{
        type: Schema.ObjectId,
        ref: 'Ingrediente',
        require: false
    }]
});

module.exports = mongoose.model('DatosUsuario', datosusuarioSchema);