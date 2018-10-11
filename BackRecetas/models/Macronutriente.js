'use strict'

var mongoose = require('../database/Mongoose Connection');
var Schema = mongoose.Schema;

var macronutrienteSchema = Schema({
   Tipo: {
       type: String,
       require: true
   },
    NroOrden: {
       type: Number,
        require: true
    },
    PorcentajeRecomendado: {
       type: Number,
        require: true
    },
    CaloriasXGramo:{
       type: Number,
        require: true
    }
});

module.exports = mongoose.model('Macronutriente', macronutrienteSchema);