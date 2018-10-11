'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var valornutricionalxusuarioSchema = Schema({
    Usuario: {
        type: Schema.ObjectId,
        ref: 'Usuario',
        require: true
    },
    ValorNutricional: {
        type: Schema.ObjectId,
        ref: 'ValorNutricional',
        require: true
    },
    Cantidad: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('ValorNutricionalXUsuario',valornutricionalxusuarioSchema);