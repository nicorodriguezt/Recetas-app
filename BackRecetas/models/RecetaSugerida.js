'use strict'

var mongoose = require('../database/Mongoose Connection');
var Schema = mongoose.Schema;

var recetasugeridaSchema = Schema({
    Menu: {
        type: Schema.ObjectId,
        ref: 'Menu',
        require: true
    },

    Receta: {
        type: Schema.ObjectId,
        ref: 'Receta',
        require: true
    },

    MomentoDelDia: {
        type: Schema.ObjectId,
        ref: 'MomentoDelDia',
        require: true
    },

    Ingerido: {
        type: Boolean,
        require: true
    },

    PorcionIngerida: {
        type: Number,
        require: true
    },

    PorcionSugerida: {
        type: Number,
        require: true
    },
});

module.exports = mongoose.model('RecetaSugerida', recetasugeridaSchema);