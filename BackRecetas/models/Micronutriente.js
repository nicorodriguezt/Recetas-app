'use strict'

var mongoose = require('../database/Mongoose Connection');
var Schema = mongoose.Schema;

var micronutrienteSchema = Schema({
    Tipo: {
        type:String,
        require: true
    },
    Rango:['EdadInicial','EdadFinal',['Sexo','ValorRecomendado']]

});

module.exports = mongoose.model('Micronutriente', micronutrienteSchema);