'use strict'

var ValorNutricionalXUsuarioSchema = require('../models/ValorNutricionalXUsuario');
var ActividadFisicaXUsuarioSchema = require('../models/ActividadFisicaXUsuario');
var DatosUsuarioSchema = require('../models/DatosUsuario');
var ActividadLaboralSchema = require('../models/ActividadLaboral');
var ActividadFisicaSchema = require('../models/ActividadFisica');
var ValorNutricionalSchema = require('../models/ValorNutricional');
var MacronutrienteSchema = require('../models/Macronutriente');
var MicronutrienteSchema = require('../models/Micronutriente');

function calcularVET(datos, actividad) {
    let consumo = 0;
    datos.ActividadLaboral.Detalles.forEach(function (element) {
        if(element.Sexo == datos.Sexo) {
            consumo = element.Consumo
        }
    });
    let vet = (datos.PesoTeorico * consumo);
    if (actividad) {
        actividad.forEach(function (element) {
            vet = vet + ((element.Consumo * element.Cantidad) / 7);
        })
    }
    return vet;
}

function calcularMacro(VET, user) {
    MacronutrienteSchema.find({NroOrden: 0}).then(function (macros) {
        calcularMacroOrden(user, macros, VET, 0);
    })
}

function calcularMacroOrden(user, macronutriente, VET, nroOrden) {
    if (!macronutriente) {
    }
    else {
        macronutriente.forEach(function (element) {
            let valorNutri;
            let cantidad = VET * (element.PorcentajeRecomendado);
            cantidad = Math.round(cantidad * 100) / 100;

            ValorNutricionalSchema.findOne({Macronutriente: element}).populate({path:'Macronutriente'}).then(function (valor) {
                valorNutri = valor;
            }).then(function () {
                ValorNutricionalXUsuarioSchema.findOne({
                    Usuario: user,
                    ValorNutricional: valorNutri
                }).then(function (valorUsuario) {
                    if (!valorUsuario) {
                        let nuevo = new ValorNutricionalXUsuarioSchema();
                        nuevo.Usuario = user;
                        nuevo.ValorNutricional = valorNutri;
                        nuevo.Cantidad = cantidad / valorNutri.Macronutriente.CaloriasXGramo;
                        nuevo.save()
                    }
                    else {
                        valorUsuario.Cantidad = cantidad / valorNutri.Macronutriente.CaloriasXGramo;
                        valorUsuario.save();
                    }
                }).then(function () {
                    MacronutrienteSchema.find({$and: [{NroOrden: nroOrden + 1}, {Tipo: element.Tipo}]}).then(function (macros) {
                        calcularMacroOrden(user, macros, cantidad, nroOrden + 1);
                    })
                });
            });
        })
    }
}

function calcularMicro(datosUsuario, user) {
    MicronutrienteSchema.find({
        Sexo: datosUsuario.Sexo,
        EdadInicial: {$lte: datosUsuario.Edad},
        EdadFinal: {$gte: datosUsuario.Edad}
    }).then(function (micros) {
        micros.forEach(function (element) {
            ValorNutricionalSchema.findOne({Nombre: element.Tipo}).then(function (valorNutricional) {
                ValorNutricionalXUsuarioSchema.findOne({
                    Usuario: user,
                    ValorNutricional: valorNutricional
                }).then(function (valorUsuario) {
                    if (!valorUsuario) {
                        let nuevo = new ValorNutricionalXUsuarioSchema();
                        nuevo.Usuario = user;
                        nuevo.ValorNutricional = valorNutricional;
                        nuevo.save()
                    }
                    else {
                        valorUsuario.save();
                    }
                })
            })
        })
    })
}

module.exports = {
    infoValores: function (req, res) {
        DatosUsuarioSchema.findOne(req.user._id).then(function (datos) {
            ValorNutricionalXUsuarioSchema.find({DatosUsuario: datos}).populate(
                {
                    path: 'ValorNutricional',
                    model: ValorNutricionalSchema
                }
            ).populate(
                {
                    path: 'Macronutriente',
                    model: MacronutrienteSchema
                }).populate(
                {
                    path: 'Micronutriente',
                    model: MicronutrienteSchema
                }).then(function (valores) {
                res.status(200).json(valores);
            })
        })
    },
    setValoresNutricionales: function (params) {
        let datosXusuario;
        let VET;
        return DatosUsuarioSchema.findOne({Usuario: params})
            .populate({
                    path: 'ActividadLaboral',
                    model: ActividadLaboralSchema
                }
            ).then((datos) => {
                datosXusuario = datos;
                let actividadxUsuario;
                ActividadFisicaXUsuarioSchema.find({DatosUsuario: datosXusuario})
                    .populate({
                        path: 'ActividadFisica',
                        model: ActividadFisicaSchema
                    })
                    .then((actividad) => {
                        actividadxUsuario = actividad;
                    }).then(function () {
                    VET = calcularVET(datosXusuario, actividadxUsuario);
                    VET = Math.round(VET * 100) / 100;
                    ValorNutricionalSchema.findOne({Nombre: 'Calorias'}).then(function (valorNutri) {
                        ValorNutricionalXUsuarioSchema.findOne({
                            Usuario: params,
                            ValorNutricional: valorNutri
                        }).then(function (valorXUsuario) {
                            if (!valorXUsuario) {
                                let nuevo = new ValorNutricionalXUsuarioSchema();
                                nuevo.Usuario = params;
                                nuevo.ValorNutricional = valorNutri;
                                nuevo.Cantidad = VET;
                                nuevo.save()
                            }
                            else {
                                valorXUsuario.Cantidad = VET;
                                valorXUsuario.save();
                            }
                        })
                    }).then(function () {
                        calcularMacro(VET, params);
                    }).then(function () {
                        calcularMicro(datosXusuario, params);
                    })
                })
            });
    }
};