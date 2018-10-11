'use strict'

var mongoose = require('../database/Mongoose Connection');
var Schema = mongoose.Schema;

var momentodeldiaSchema = Schema({
    Nombre: {
        type: String,
        require: true
    },
    Porcentaje: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('MomentoDelDia', momentodeldiaSchema);