'use strict'

var ValorNutricionalSchema = require('../models/ValorNutricional');
var IngredienteSchema = require('../models/Ingrediente');
var ValorNutricionalXIngredienteSchema = require('../models/ValorNutricionalXIngrediente')


function CrearIngrediente(Nombre,callback) {
    let datos = new IngredienteSchema();
    datos.Nombre = Nombre.toLowerCase();
    datos.save((err, datos) => {
        if (err) callback(err);
        else callback(datos);
    });
}

function CrearValorXIngrediente(Valor,Nombre, porcion, unidad, unidadValor,ingrediente) {
    let datos = new ValorNutricionalXIngredienteSchema();
    datos.Ingrediente = ingrediente;
    datos.Porcion = porcion;
    datos.CandtidadContenida = Valor;
    datos.Unidad = unidadValor;
    datos.UnidadPorcion = unidad;

    ValorNutricionalSchema.findOne({ Nombre:Nombre, Micronutriente:{$exists:false} }).then((valor) => {
        datos.ValorNutricional = valor;
        datos.save();
        })
}

async function BuscarTodosIngredientes () {
    return IngredienteSchema.find({});
}

module.exports = {
    addIngrediente: function (req, res) {
           CrearIngrediente(req.body.Ingrediente, function (Ingrediente) {
               let Calcio = req.body.Calcio;
               let Hierro = req.body.Hierro;
               let Fibra = req.body.Fibra;
               let Proteina = req.body.Proteina;
               let Hidrato = req.body.Hidrato;
               let GrasaSaturada = req.body.GrasaSaturada;
               let GrasaOtra = req.body.GrasaOtra;
               let Calorias = req.body.Calorias;

               if(Calcio!=0)
               {
                   CrearValorXIngrediente(Calcio, 'Calcio', req.body.Porcion, req.body.Unidad, req.body.UnidadMicro, Ingrediente)
               }

               if(Calorias!=0)
               {
                   CrearValorXIngrediente(Calorias, 'Calorias', req.body.Porcion, req.body.Unidad, 'Kilocalorias', Ingrediente)
               }

               if(Hierro!=0)
               {
                   CrearValorXIngrediente(Hierro, 'Hierro', req.body.Porcion, req.body.Unidad, req.body.UnidadMicro, Ingrediente)
               }

               if(Fibra!=0)
               {
                   CrearValorXIngrediente(Fibra, 'Fibra', req.body.Porcion, req.body.Unidad, req.body.UnidadMicro, Ingrediente)
               }

               if(Proteina!=0)
               {
                   CrearValorXIngrediente(Proteina, 'Proteina General', req.body.Porcion, req.body.Unidad, req.body.UnidadMacro, Ingrediente)
               }

               if(Hidrato!=0)
               {
                   CrearValorXIngrediente(Hidrato, 'Hidrato General', req.body.Porcion, req.body.Unidad, req.body.UnidadMacro, Ingrediente)
               }

               if(GrasaSaturada!=0)
               {
                   CrearValorXIngrediente(GrasaSaturada, 'Grasa Saturada', req.body.Porcion, req.body.Unidad, req.body.UnidadMacro, Ingrediente)
               }

               if(GrasaOtra!=0)
               {
                   CrearValorXIngrediente(GrasaOtra, 'Grasa Otra', req.body.Porcion, req.body.Unidad, req.body.UnidadMacro, Ingrediente)
               }
               if(!Ingrediente){
                   res.status(500).send({message: 'No se creo el ingrediente'});
               }
               else{
                   res.status(200).json(Ingrediente);
               }
           })
    },

    traerIngredientes: async function (req,res) {
       let ingredientes = await BuscarTodosIngredientes();
        if(!ingredientes){
            res.status(500).send({message: 'No se encontraron ingredientes'});
        }
        else{
            res.status(200).json(ingredientes);
        }
    }
};