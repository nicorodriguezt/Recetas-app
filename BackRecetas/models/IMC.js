'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var IMCSchema = Schema({
    ValorMin:{
        type: Number,
        require: true
    },
    ValorMax: {
        type: Number,
        require: true
    },
    Clasificacion: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('IMC',IMCSchema);