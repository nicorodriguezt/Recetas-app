'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;

var valornutricionalSchema = Schema({
    Nombre: {
        type: String,
        require: true
    },
    Macronutriente:{
        type: Schema.ObjectId,
        ref:'Macronutriente',
        require: false
    },
    Micronutriente:{
        type: Schema.ObjectId,
        ref: 'Micronutriente',
        require: false
    },
    RangoVariacion:{
        type: Number,
        require: false
    }

});

module.exports = mongoose.model('ValorNutricional',valornutricionalSchema);