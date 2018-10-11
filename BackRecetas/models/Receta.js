'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var recetaSchema = Schema({
    Nombre: {
        type: String,
        require: true
    },
    Pasos: [{
        type: String,
        require: true
    }],

    MomentoDelDia: [{
        type: Schema.ObjectId,
        ref: 'MomentoDelDia',
        require: true
    }],

    IngredientePrincipal: {
        type: Schema.ObjectId,
        ref: 'Ingrediente',
        require: true
    },

    Ingredientes: [{
        type: Schema.ObjectId,
        ref: 'IngredienteXReceta',
        require: true
    }],

    Valores: [{
        type: Schema.ObjectId,
        ref: 'ValorNutricionalXReceta',
        require: true
    }],

    TipoComida:  {
        type: String,
        require: true
    },

    Multiplicable:{
        type: Boolean,
        require: true
    },

    Porciones:{
        type: Number,
        require: true
    },

    Descripcion:{
        type: String,
        require: true
    },

    Puntaje:{
        type: Number,
        require: true
    },

    Calorias:{
        type: Number,
        require: true
    },

    FechaCreacion:{
        type: Date,
        require: true
    }
});

module.exports = mongoose.model('Receta',recetaSchema);