'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var actividadfisicaSchema = Schema({
    TipoActividad: {
        type: String,
        require: true
    },
    Modalidad: {
        type: String,
        require: false
    },
    Consumo90: {
        type: Number,
        require: true
    },
    Consumo60: {
        type: Number,
        require: true
    },
    Distancia: {
        type: String,
        require: false
    }

});

module.exports = mongoose.model('ActividadFisica',actividadfisicaSchema);