'use strict'

var express = require('express');
var router = express.Router();
var RecetaService = require('../../services/RecetaS');

module.exports = function(passport) {

    router.post('/add', passport.Autenticado, function (req,res) {
        RecetaService.addReceta(req, res);
    });

    router.get('/find', passport.Autenticado, function (req,res) {
        RecetaService.buscarRecetas(req, res);
    });

    router.get('/verReceta/:id', passport.Autenticado, function (req,res) {
        RecetaService.verReceta(req,res)
    });

    return router
};