'use strict';

var DatosUsuarioSchema = require('../models/DatosUsuario');
var IngredienteSchema = require('../models/Ingrediente');
var IMCSchema = require('../models/IMC');
var PesoTeoricoSchema = require('../models/PesoTeorico');
var ActividadLaboralSchema = require('../models/ActividadLaboral');
var ValorNutricionalXUsuario = require('../services/ValorNutricionalXUsuarioS');

function getIMC(params, callback) {
    let altura = params.Altura / 100;
    if (params.PesoAprox || params.Altura) {
        var IMC = params.PesoAprox / (altura * altura);
        IMC = Math.round(IMC * 10) / 10
    }
    IMCSchema.findOne({$and: [{ValorMin: {$lte: IMC}, ValorMax: {$gte: IMC}}]}, function (err, IMCtabla) {
        if (err) callback(err);
        else callback(IMCtabla);
    })
}

function getPesoTeorico(params, callback) {
    let peso;
    PesoTeoricoSchema.find({Sexo: params.Sexo}).then((pesos) => {
        peso = pesos[0]._doc;
        for (var i in pesos) {
            if (Math.abs(params.Altura - pesos[i]._doc.Altura) <= Math.abs(params.Altura - peso.Altura) && Math.abs(params.Edad - pesos[i]._doc.Edad) <= Math.abs(params.Edad - peso.Edad)) {
                peso = pesos[i]._doc;
            }
        }
        callback(peso);
    });

}

module.exports = {


    setDatos: function (req, res) {
        let params = req.body;
        params.ActividadLaboral = params.ActividadLaboral._id;
        params.Usuario = req.user;
            getPesoTeorico(params, function (Pesos) {
                params.PesoTeorico = Pesos.Peso;
                getIMC(params, function (IMCtabla) {
                    params.IMC = IMCtabla.Clasificacion;
                    DatosUsuarioSchema.update({Usuario: req.user._id}, params, {upsert: true}).then(function (datosUpdated, err) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            if (!datosUpdated) {
                                res.status(404).send({message: 'Datos no actualizado'});
                            }
                            else {
                                ValorNutricionalXUsuario.setValoresNutricionales(req.user._id)
                                    .then(function () {
                                        res.status(200).json(datosUpdated)
                                    });
                            }
                        }
                    });
                });
            })
    },

    infoDatos: function (req, res) {
        DatosUsuarioSchema.findOne({Usuario: req.user._id}).then(function (datos) {
            res.status(200).json(datos);

        });
    },

    addPreferencias: function (req, res) {
        IngredienteSchema.findOne({Nombre: req.body.Nombre}, function (err, ingrediente) {
            if (err) {
                res.status(500).send(err);
            } else {
                if (!ingrediente) {
                    res.status(404).send({message: 'No existe ingrediente'});
                }
                else {
                    DatosUsuarioSchema.findOneAndUpdate({Usuario: req.user._id},
                        {$addToSet: {Preferencias: ingrediente}}, function (err, datos) {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                if (!datos) {
                                    res.status(404).send({message: 'No existe datos usuario'});
                                } else {
                                    res.status(200).json(datos);
                                }
                            }
                        })
                }
            }
        })
    },

    removePreferencias: function (req, res) {
        IngredienteSchema.find({Nombre: req.body.Nombre}, function (err, ingrediente) {
            if (err) {
                res.status(500).send(err);
            } else {
                if (!ingrediente) {
                    res.status(404).send({message: 'No existe ingrediente'});
                }
                else {
                    DatosUsuarioSchema.findOneAndUpdate({Usuario: req.user._id},
                        {$pullAll: {Preferencias: ingrediente}}, function (err, datos) {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                if (!datos) {
                                    res.status(404).send({message: 'No existe datos usuario'});
                                } else {
                                    res.status(200).json(datos);
                                }
                            }
                        });
                }
            }
        })
    },

    infoPreferencias: function (req, res) {
        DatosUsuarioSchema.findOne({Usuario: req.user._id})
            .populate({
                path: 'Preferencias',
                model: IngredienteSchema
            }).exec(function (err, datos) {
            if (err) {
                res.status(500).send(err);
            } else {
                if (!datos) {
                    res.status(404).send({message: 'No existen datos cargados'});
                }
                else {
                    res.status(200).json(datos.Preferencias);
                }

            }
        });
    },

    infoActividadLaboral: function (req, res) {
        DatosUsuarioSchema.findOne({Usuario: req.session.passport.user})
            .populate({
                path: 'ActividadLaboral',
                model: ActividadLaboralSchema,
                select: 'Categoria'
            })
            .then(function (datos) {
                res.status(200).json(datos);
            });
    },

    listActividades: function (req, res) {
        ActividadLaboralSchema.find({},'Categoria Descripcion').then(function (actividades) {
            res.status(200).json(actividades);
        })
    }
};