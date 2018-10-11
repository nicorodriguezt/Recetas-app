'use strict'

var express = require('express');
var router = express.Router();
var ActividadFisicaXUsuario = require('../../services/ActividadFisicaXUsuarioS');

module.exports = function(passport) {

    router.get('/info', passport.Autenticado, function (req,res) {
        ActividadFisicaXUsuario.infoActividades(req,res);
    });

    router.post('/add', passport.Autenticado, function (req,res) {
        ActividadFisicaXUsuario.addActividad(req,res);
    });

    router.put('/remove', passport.Autenticado, function (req,res) {
        ActividadFisicaXUsuario.removeActividad(req,res);
    });
    router.get('/list', passport.Autenticado, function (req,res) {
        ActividadFisicaXUsuario.listActividades(req,res)
    });

    return router
}