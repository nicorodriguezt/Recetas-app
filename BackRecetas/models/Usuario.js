'use strict'

var mongoose = require("../database/Mongoose Connection");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var usuarioSchema = Schema({

    Nombre: {
        type: String,
        required: true
    },
    Apellido: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    UserName: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    }
});

usuarioSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
};

usuarioSchema.methods.comparePassword = function(password, hash){
    return bcrypt.compareSync(password, hash);
};

module.exports = mongoose.model('Usuario',usuarioSchema);
