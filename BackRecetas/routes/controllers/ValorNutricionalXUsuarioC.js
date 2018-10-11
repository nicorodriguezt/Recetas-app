'use strict'

var express = require('express');
var router = express.Router();
var ValorNutricionalXUsuario = require('../../services/ValorNutricionalXUsuarioS');

module.exports = function(passport) {

    router.get('/info', passport.Autenticado, function (req,res) {
       ValorNutricionalXUsuario.infoValores(req,res);
    });
    return router
}