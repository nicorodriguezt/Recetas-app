'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var actividadfisicaxusuarioSchema = Schema({
    ActividadFisica: {
        type: Schema.ObjectId,
        ref: 'ActividadFisica',
        require: true
    },
    DatosUsuario: {
        type: Schema.ObjectId,
        ref: 'DatosUsuario',
        require: true
    },
    Cantidad: {
        type: Number,
        require: true
    },
    Consumo: {
        type: Number,
        require: true
    },
    DistanciaRecorrida: {
        type: Number,
        require: false
    }
});

module.exports = mongoose.model('ActividadFisicaXUsuario',actividadfisicaxusuarioSchema);