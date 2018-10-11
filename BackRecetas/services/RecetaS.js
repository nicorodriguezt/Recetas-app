'use strict';

let IngredienteSchema = require('../models/Ingrediente');
let ValorNutricionalSchema = require('../models/ValorNutricional');
let RecetaSchema = require('../models/Receta');
let ValorNutricionalXRecetaSchema = require('../models/ValorNutricionalXReceta');
let ValorNutricionalXIngredienteSchema = require('../models/ValorNutricionalXIngrediente');
let IngredienteXRecetaSchema = require('../models/IngredienteXReceta');
let MomentoSchema = require('../models/MomentoDelDia');
let moment = require('moment-timezone');

function CrearReceta(params, callback) {
    let datos = new RecetaSchema();
    datos.Nombre = params.body.Nombre.toLowerCase();
    datos.Pasos = params.body.Pasos;
    datos.Descripcion = params.body.Descripcion;
    datos.Puntaje = 100;
    datos.TipoComida = params.body.TipoComida.toLowerCase();
    datos.Multiplicable = params.body.Multiplicable;
    datos.Porciones = params.body.Porciones;
    datos.Calorias = 0;
    datos.FechaCreacion = moment().tz('America/Argentina/Cordoba').format('YYYY-MM-DD');

    MomentoSchema.find({Nombre: {$in: params.body.Momentos}}).then((momentos) => {
        datos.MomentoDelDia = momentos;
    }).then(() => {
        IngredienteSchema.findOne({Nombre: params.body.IngredientePrincipal}).then((ingrediente) => {
            datos.IngredientePrincipal = ingrediente;
            return datos;
        }).then((datos) => {
            datos.save((err, datos) => {
                if (err) callback(err);
                else callback(datos);
            })
        })
    })
}


function CrearIngredientesXReceta(params, receta, callback) {
    let ingredientes = params.body.Ingredientes;
    CrearIngredientes(ingredientes).then((ingredienteXreceta) => {
        receta.Ingredientes = ingredienteXreceta;
        receta.save((err, receta) => {
            if (err) callback();
            else callback(receta);
        })
    })
}

async function CrearIngredientes(ingre) {
    let ingreXre = [];
    for(let info of ingre){
        let datos = new IngredienteXRecetaSchema();
        datos.Unidad = info.Unidad;
        datos.Cantidad = info.Cantidad;
        datos.Ingrediente = await IngredienteSchema.findOne({Nombre: info.Ingrediente});
        datos = await datos.save();
        ingreXre.push(datos);
    }
    return ingreXre;
}

async function CrearValoresNutricionalesRecta(receta) {
    let valores = [];
    for (let ingre of receta.Ingredientes) {
        valores = await ValorNutricionalXIngredienteSchema.find({Ingrediente: ingre.Ingrediente}).populate(
            {
                path: 'ValorNutricional',
                model: ValorNutricionalSchema
            });
        for (let valor of valores) {
            const dato = await CalcularValorXReceta(valor, ingre, receta);
        }
    }
    receta = await receta.save();
    return receta;
}

async function CalcularValorXReceta(valor, ingre, receta) {
    if(valor.ValorNutricional.Nombre === "Calorias"){
        receta.Calorias = Math.round(receta.Calorias + ingre.Cantidad * valor.CandtidadContenida / valor.Porcion);
        return await receta.save();
    }
    else{
        let valorExistente = await ValorNutricionalXRecetaSchema.findOne({ValorNutricional: valor.ValorNutricional,
        Receta: receta});

        if (!valorExistente) {
            valorExistente = new ValorNutricionalXRecetaSchema();
            valorExistente.Cantidad = Math.round(ingre.Cantidad * valor.CandtidadContenida / valor.Porcion);
            valorExistente.ValorNutricional = valor.ValorNutricional;
            valorExistente = await valorExistente.save();

        }
        else {
            valorExistente.Cantidad = valorExistente.Cantidad +  Math.round(ingre.Cantidad * valor.CandtidadContenida / valor.Porcion);
            valorExistente = await valorExistente.save();
        }


        if(!receta.Valores.includes(valorExistente)){
            receta.Valores.push(valorExistente);
        }

        return receta;
    }
}



module.exports = {
    addReceta: function (req, res) {
        CrearReceta(req, function (receta) {
            CrearIngredientesXReceta(req, receta, async function (dato) {
                if (!dato) {
                    res.status(500).send({message: 'No se creo correctamente la receta'});
                }
                else {
                    let datos = await CrearValoresNutricionalesRecta(receta);

                    if (!datos) {
                        res.status(500).send({message: 'No se creo correctamente la receta'});
                    }
                    else {
                        res.status(200).json(datos);

                    }
                }
            });
        });
    },

    buscarRecetas: function (req, res) {
        var nombreReceta = req.query.Nombre.toLowerCase();
        let skip = Number(req.query.Saltar);
        let limit = Number(req.query.Limite);

        RecetaSchema.aggregate([
            {$unwind: '$Ingredientes'},
            {
                $lookup: {
                    from: 'ingredientexrecetas',
                    localField: 'Ingredientes',
                    foreignField: '_id',
                    as: 'ingredientesRecetas'
                }
            },
            {$unwind: '$ingredientesRecetas'},
            {
                $lookup: {
                    from: 'ingredientes',
                    localField: 'ingredientesRecetas.Ingrediente',
                    foreignField: '_id',
                    as: 'ingrediente'
                }
            },
            {$unwind: '$ingrediente'},
            {
                $lookup: {
                    from: 'momentodeldias',
                    localField: 'MomentoDelDia',
                    foreignField: '_id',
                    as: 'momento'
                }
            },
            {
                $match:
                    {
                        $or: [
                            {Nombre: new RegExp(nombreReceta)},
                            {Descripcion: new RegExp(nombreReceta)},
                            {'ingrediente.Nombre': new RegExp(nombreReceta)}
                        ]
                    }
            },
            {
                $group: {
                    _id: "$_id",
                    Nombre: {$addToSet: '$Nombre'}, Descripcion: {$addToSet: '$Descripcion'}, MomentoDelDia: {$addToSet:'$momento.Nombre'} }
            },
            {$skip: skip},
            {$limit: limit},
            {$unwind: '$Nombre'},
            {$unwind: '$Descripcion'},
            {$unwind: '$MomentoDelDia'}
        ]).then(function (recetas) {
            res.status(200).json(recetas)
        })

    },

    verReceta: function (req, res) {
        var populateQuery = [{path: 'Ingredientes', populate: {path: 'Ingrediente'}}, {
            path: 'MomentoDelDia',
            select: 'Nombre'
        }];
        var param = req.params.id;
        RecetaSchema.findOne({_id: param})
            .populate(populateQuery)
            .then(function (receta) {
                res.status(200).json(receta);
            })

    }

};