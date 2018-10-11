'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var actividadlaboralSchema = Schema({
    Categoria: {
        type: String,
        require: true
    },
    Descripcion: {
        type: String,
        require: true
    },
    Detalles: ["Sexo", "Consumo"]
});
module.exports = mongoose.model('ActividadLaboral', actividadlaboralSchema);
