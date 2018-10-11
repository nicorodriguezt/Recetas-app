'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var unidadSchema = Schema({
    Nombre: {
        type: String,
        require: true
    }


});

module.exports = mongoose.model('Unidad', unidadSchema);