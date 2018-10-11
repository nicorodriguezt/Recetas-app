'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var categoriaSchema = Schema({
    Nombre: {
        type: String,
        require: true
    },

});

module.exports = mongoose.model('Categoria', categoriaSchema);