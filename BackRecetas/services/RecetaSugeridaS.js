'use strict';

let IngredienteSchema = require('../models/Ingrediente');
let ValorNutricionalSchema = require('../models/ValorNutricional');
let RecetaSchema = require('../models/Receta');
let ValorNutricionalXRecetaSchema = require('../models/ValorNutricionalXReceta');
let ValorNutricionalXIngredienteSchema = require('../models/ValorNutricionalXIngrediente');
let IngredienteXRecetaSchema = require('../models/IngredienteXReceta');
let RecetaSugeridaSchema = require('../models/RecetaSugerida');
let MomentoSchema = require('../models/MomentoDelDia');
let moment = require('moment-timezone');





module.exports = {
    cambiarEstado: async function (req, res) {
        let idReceta = req.id;
        let recetaSugerida = await RecetaSugeridaSchema.findById(idReceta);
        recetaSugerida.Ingerido = req.Ingerido;
        if(req.PorcionIngerida)
        recetaSugerida.PorcionIngerida = req.PorcionIngerida;
        else
            recetaSugerida.PorcionIngerida = recetaSugerida.PorcionSugerida;

        recetaSugerida = recetaSugerida.save();
        if (!recetaSugerida) {
            res.status(500).send({message: 'No se actualizo correctamente la receta'});
        }
        else {
            res.status(200).json(recetaSugerida);
            }
    }
};