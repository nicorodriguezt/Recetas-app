'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var pesoteoricoSchema = Schema({
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
    Peso: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('PesoTeorico',pesoteoricoSchema);
