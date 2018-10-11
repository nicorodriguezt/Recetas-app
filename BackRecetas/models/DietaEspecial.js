'use strict'

var mongoose = require('../database/Mongoose Connection');
var Schema = mongoose.Schema;

var DietaEspecialSchema = Schema({
    Nombre: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('DietaEspecial', DietaEspecialSchema);