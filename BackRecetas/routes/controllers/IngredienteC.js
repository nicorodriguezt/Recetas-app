'use strict'

var express = require('express');
var router = express.Router();
var IngredienteService = require('../../services/IngredienteS');

module.exports = function(passport) {

    router.post('/add', passport.Autenticado, function (req,res) {
        IngredienteService.addIngrediente(req, res);
    });

    router.get('/getAll', passport.Autenticado, function (req,res) {
        IngredienteService.traerIngredientes(req,res);
    });
    return router;
}