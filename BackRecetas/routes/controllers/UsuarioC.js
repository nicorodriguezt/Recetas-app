'use strict'

var express = require('express');
var router = express.Router();
var UsuarioService = require('../../services/UsuarioS');

module.exports = function (passport) {

    router.post('/login',passport.authenticate('local-login',{
        failureRedirect:'/usuario/login',
    }), function (req, res) {
        req.login(req.user, (err) => {
            if (err) {
                res.status(500).send(err);
                throw err;
            }
            res.json(req.session);
        })});

    router.post('/registrar', function (req, res) {
        UsuarioService.postRegistro(req, res);
    });

    router.get('/logout', passport.Autenticado, function (req, res) {
        UsuarioService.logOut(req, res);
    });

    router.get('/info', passport.Autenticado, function (req, res) {
        res.json(req.user);
    });

    router.put('/update', passport.Autenticado, function (req, res) {
        UsuarioService.update(req,res);
    });

    return router;
};



