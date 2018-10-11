'use strict'

var express = require('express');
var router = express.Router();
var RecetaSugeridaService = require('../../services/RecetaSugeridaS');

module.exports = function(passport) {

    router.post('/update', passport.Autenticado, function (req,res) {
        RecetaSugeridaService.cambiarEstado(req, res);
    });

    return router
};