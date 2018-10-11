'use strict';

var express = require('express');
var router = express.Router();
var DatosUsuarioService = require('../../services/DatosUsuarioS');

module.exports = function(passport){

    router.post('/set',passport.Autenticado,function (req,res) {
        DatosUsuarioService.setDatos(req,res);
    });

    router.get('/info',passport.Autenticado,function (req,res) {
        DatosUsuarioService.infoDatos(req,res);
    });

    router.put('/preferencias/add',passport.Autenticado,function (req,res) {
        DatosUsuarioService.addPreferencias(req,res);
    });

    router.put('/preferencias/remove',passport.Autenticado,function (req,res) {
        DatosUsuarioService.removePreferencias(req,res);
    });

    router.get('/preferencias/info',passport.Autenticado,function (req,res) {
        DatosUsuarioService.infoPreferencias(req,res);
    });

    router.get('/actividadlaboral/info',passport.Autenticado,function (req,res) {
        DatosUsuarioService.infoActividadLaboral(req,res);
    });

    router.get('/actividadlaboral/list', function (req,res) {
        DatosUsuarioService.listActividades(req,res)
    });

    return router;
};