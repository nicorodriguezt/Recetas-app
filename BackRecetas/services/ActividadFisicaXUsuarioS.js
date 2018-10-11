'use strict'

var ActividadFisicaXUsuarioSchema = require('../models/ActividadFisicaXUsuario');
var ActividadFisicaSchema = require('../models/ActividadFisica');
var DatosUsuarioSchema = require('../models/DatosUsuario');
var ValorNutricionalXUsuario = require('../services/ValorNutricionalXUsuarioS');

function getDatosUsuario(params, callback) {
    DatosUsuarioSchema.findOne({Usuario: params}, function (err, datos) {
        if (err) callback(err);
        else callback(datos);
    })
}

function getActividad(params, callback) {
    ActividadFisicaSchema.findOne({
        TipoActividad: params.TipoActividad,
        Modalidad: params.Modalidad,
        Distancia: params.Distancia
    }, function (err, actividad) {
        if (err) callback(err);
        else callback(actividad);
    })

}

module.exports = {

    infoActividades: function (req, res) {
        getDatosUsuario(req.user._id, function (datos) {
            ActividadFisicaXUsuarioSchema.find({DatosUsuario: datos}).populate({
                path: 'ActividadFisica',
                model: ActividadFisicaSchema
            }).then(function (actividadesUsuario) {
                for (var i = 0; i < actividadesUsuario.length; i++) {
                    delete actividadesUsuario[i]._doc._id;
                    delete actividadesUsuario[i]._doc.DatosUsuario;
                    delete actividadesUsuario[i]._doc.Consumo;
                    delete actividadesUsuario[i]._doc.ActividadFisica._doc._id;
                    delete actividadesUsuario[i]._doc.ActividadFisica._doc.Consumo90;
                    delete actividadesUsuario[i]._doc.ActividadFisica._doc.Consumo60;

                }
                res.status(200).json(actividadesUsuario);
            });
        })
    },

    listActividades: function (req, res) {
        ActividadFisicaSchema.find().then(function (actividades) {
            for (var i = 0; i < actividades.length; i++) {
                delete actividades[i]._doc._id;
                delete actividades[i]._doc.Consumo90;
                delete actividades[i]._doc.Consumo60;
            }
            res.status(200).json(actividades);
        })
    },

    addActividad: function (req, res) {
        let params = req.body;

        getDatosUsuario(req.user._id, function (datos) {
            params.DatosUsuario = datos;

            getActividad(params, function (actividad) {
                params.ActividadFisica = actividad;

                if (datos.PesoAprox >= 90) params.Consumo = actividad.Consumo90;
                else params.Consumo = actividad.Consumo60;
                ActividadFisicaXUsuarioSchema.update(
                    {ActividadFisica: params.ActividadFisica, DatosUsuario: params.DatosUsuario},
                    params, {upsert: true}, function (err, AFxU) {
                        if (err) res.status(500).send(err)
                        else {
                            ValorNutricionalXUsuario.setValoresNutricionales(req.user._id)
                                .then(function () {
                                    res.status(200).json(AFxU)
                                });
                        }
                    })
            })
        })

    },

    removeActividad: function (req, res) {
        let params = req.body;

        getDatosUsuario(req.user._id, function (datos) {
            params.DatosUsuario = datos;
            getActividad(params, function (actividad) {
                params.ActividadFisica = actividad;
                ActividadFisicaXUsuarioSchema.remove(
                    {ActividadFisica: params.ActividadFisica, DatosUsuario: params.DatosUsuario}, function (err) {
                        if (err) res.status(500).send(err)
                        else {
                            ValorNutricionalXUsuario.setValoresNutricionales(req.user._id)
                                .then(function () {
                                    res.status(200).send({message: 'Borrado con exito'})
                                });
                        }
                    })
            })
        })

    }
}
