'use strict'

var express = require('express');
var router = express.Router();
var MenuS = require('../../services/MenuS');

module.exports = function(passport) {

    router.get('/menucompleto',passport.Autenticado, function (req,res) {
        MenuS.MenuCompleto(req,res);
    });

    router.get('/infoMenu/:fecha', passport.Autenticado, function (req,res) {
        MenuS.informacionMenu(req,res);
    });

    return router
};