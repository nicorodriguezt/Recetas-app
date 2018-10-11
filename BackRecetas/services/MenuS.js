'use strict';

let MomentoDelDiaSchema = require ('../models/MomentoDelDia');
let ValorNutricionalXUsuarioSchema = require ('../models/ValorNutricionalXUsuario');
let ValorNutricionalXMenuSchema = require('../models/ValoresNutricionalesXMenu');
let ValorNutricionalSchema = require('../models/ValorNutricional');
let RecetaSchema = require('../models/Receta');
let DatosUsuarioSchema = require('../models/DatosUsuario');
let MenuSchema = require('../models/Menu');
let RecetaSugeridaSchema = require('../models/RecetaSugerida');
let moment = require('moment-timezone');

async function ControlarValores(menu, recetasMenu, i, x, user) {
    let valoresNutricionales = await ValorNutricionalXUsuarioSchema.find({Usuario: user,}).populate({path:'ValorNutricional'});
    let valores =[];

    //Creo los valores nutricionales por receta
    for(let element of menu.Recetas){
        let receta = element.Receta;
        for(let valor of receta.Valores){
            if(!valores.includes(r => r.ValorNutricional === valor.ValorNutricional)){
                let valorXMenu = new ValorNutricionalXMenuSchema();
                valorXMenu.Menu = menu;
                valorXMenu.ValorNutricional = valor.ValorNutricional;
                valorXMenu.Cantidad = valor.Cantidad * element.PorcionSugerida;
                valorXMenu.Unidad = valor.Unidad;
                valores.push(valorXMenu);
            }
            else{
                let valorExistente = await valores.find(r => r.ValorNutricional === valor.ValorNutricional);
                valorExistente.Cantidad += valor.Cantidad * element.PorcionSugerida;
            }
        }
        menu.Calorias += receta.Calorias;
    }

    //Controlo que los valores sean correctos
    for(let element of valoresNutricionales){
        if(element.ValorNutricional.Nombre!== "Calorias" && element.ValorNutricional!== "Grasa General" ) {
            for(let v of valores) {
                if (v._doc.ValorNutricional._doc.Nombre === element._doc.ValorNutricional._doc.Nombre) {
                    let limiteSuperior = element.Cantidad + element.Cantidad * 0.08;
                    let limiteInferior = element.Cantidad - element.Cantidad * 0.08;
                    if (v._doc.Cantidad < limiteInferior && v._doc.Cantidad > limiteSuperior) {
                        x += 1;
                        if (x > recetasMenu[1].length) {
                            x = 0;
                            i += 1;
                        }

                        menu = await AgregarRecetas(menu, recetasMenu, i, j, user);
                    }
                }
            }
        }
    }
    for(let el of valores){
        let valorNutXRec = await el.save();
        menu.Valores.push(valorNutXRec)
    }

    return menu
}

async function AgregarRecetas(menu, recetas, i, j, user) {
    let recetasSugeridas =[];
    for(let element of recetas){
        let recetaSugerida = new RecetaSugeridaSchema();
        recetaSugerida.Menu = menu;
        recetaSugerida.MomentoDelDia = element[0];
        recetaSugerida.Ingerido= false;
        recetaSugerida.PorcionIngerida = 0;

        if(element[0].Nombre === "Desayuno" || element[0].Nombre === "Merienda"){
            recetaSugerida.Receta = element[1][0][0];
            recetaSugerida.PorcionSugerida = element[1][0][1];
        }
        else if(element[0].Nombre === "Almuerzo") {
            recetaSugerida.Receta = element[1][i][0];
            recetaSugerida.PorcionSugerida = element[1][i][1];
        }
        else {
            recetaSugerida.Receta = element[1][j][0];
            recetaSugerida.PorcionSugerida = element[1][j][1];
        }

        recetasSugeridas.push(recetaSugerida);
    }

    menu.Recetas = recetasSugeridas;
    menu = await ControlarValores(menu, recetas, i, j, user);

    return menu;
}

async function crearMenu(user,recetasMenu, date) {
    let menu = new MenuSchema();
    menu.Fecha = moment(date.toString());
    menu.Usuario = user;
    menu.Calorias = 0;
    menu = await AgregarRecetas(menu,recetasMenu,0,0,user);

    //Guardo las recetas sugeridas
    for(let element of menu.Recetas){
        let receta = await element.save();
    }
    return await menu.save();
}

async function ControlarRecetas(momento,user, fec) {
    //Controlo las preferencias
    let rec = momento[1];
    let recetas = [];
    let ultimosIngredientes = [];
    let ultimosTipoComida = [];
    let date = moment(fec.toString()).subtract(7, 'days').format('YYYY-MM-DD');
    let ultimosdias = moment(fec.toString()).subtract(2, 'days').format('YYYY-MM-DD');
    let datos = await DatosUsuarioSchema.findOne({Usuario: user});
    let preferencias = datos.Preferencias;

    if(preferencias.length>0) {
        let menu = [];
        for (let receta of rec) {
            for (let ingrediente of preferencias) {
                if(!receta[0].Ingredientes.includes(ingrediente)) {
                    menu.push(receta)
                }
            }
        }
        momento[1] = menu;
    }
    //Controlo y cambio los puntajes de acuerdo a menus anteriores
    if (momento[0]._doc.Nombre !== "Desayuno" && momento[0]._doc.Nombre  !== "Merienda"){
        let recetario = momento[1];
        let menuPrevios = await MenuSchema.find({$and: [{Usuario: user, Fecha: {$lte: fec}},{Usuario: user,
            Fecha: {$gte: date}}]}).populate({path: 'Recetas', populate:{path:'MomentoDelDia'}});
        let ultimosmenus = await MenuSchema.find({$and: [{Usuario: user, Fecha: {$lte: fec}},{Usuario: user,
            Fecha: {$gte: ultimosdias}}]}).populate({path: 'Recetas', populate:{path:'Receta MomentoDelDia',
                populate:{path:'IngredientePrincipal'}}});

        for(let men of menuPrevios){
            for(let element of men.Recetas) {
                if (element.MomentoDelDia.Nombre !== "Desayuno" && element.MomentoDelDia.Nombre  !== "Merienda")
                    recetas.push(element.Receta);
            }
        }
        for(let men of ultimosmenus){
            for(let element of men.Recetas) {
                if (element.MomentoDelDia.Nombre !== "Desayuno" && element.MomentoDelDia.Nombre  !== "Merienda") {
                    ultimosTipoComida.push(element.Receta.TipoComida);
                    ultimosIngredientes.push(element.Receta.IngredientePrincipal);
                }
            }
        }

        for(let elemento of recetario){
            if(recetas.length > 0) {
                for (let y of recetas) {
                    let h = y.id;
                    let j = elemento[0]._doc._id.id;
                    if (h.equals(j)) {
                        elemento[0]._doc.Puntaje -= 10;
                    }
                }
            }

            if(ultimosIngredientes.length > 0) {
                for (let j of ultimosIngredientes) {
                    if (j._id.id.equals(elemento[0]._doc.IngredientePrincipal.id)) {
                        elemento[0]._doc.Puntaje -= 15;
                    }
                }
            }

            if(ultimosTipoComida.length > 0) {
                for (let x of ultimosTipoComida) {
                    if (x === elemento[0]._doc.TipoComida) {
                        elemento[0]._doc.Puntaje -= 15;
                    }
                }
            }
        }
        momento[1] = recetario;
        momento[1].sort(function(a, b){return b[0].Puntaje-a[0].Puntaje});
     }

    return momento;
}

async function getReceta(valor, momento) {
    //Obtengo las recetas con las calorías necesarias
    let limiteInferior = valor - valor * 0.08;
    let limiteSuperior = valor + valor * 0.08;
    let arreglo =[];
    let recetas =await RecetaSchema.find({
        $and: [{
            MomentoDelDia: momento._doc._id,
            Calorias: {$lt: limiteSuperior}
        },{
            MomentoDelDia: momento._doc._id,
            Calorias: {$gt: limiteInferior}
        }]
    }).populate({path: 'Ingredientes',
        populate: {path: 'Ingrediente'} }).populate({path: 'Valores',
                                                populate:{path: 'ValorNutricional'}}).sort({Puntaje:-1});
    for(let el of recetas){
        let arr=[el,1];
        arreglo.push(arr);
    }

    if(arreglo.length< 10){
        let recetas = await RecetaSchema.find({
            $and: [{
                MomentoDelDia: momento._doc._id,
                Calorias: {$lt: limiteSuperior/2},
                Multiplicable: true
            },{
                MomentoDelDia: momento._doc._id,
                Calorias: {$gt: limiteInferior/2},
                Multiplicable: true
            }]
        }).populate({path: 'Ingredientes',
            populate: {path: 'Ingrediente'} }).populate({path: 'Valores',
            populate:{path: 'ValorNutricional'}}).sort({Puntaje:-1});

        for(let el of recetas){
            let arr=[el,1];
            arreglo.push(arr);
        }
    }

    if(arreglo.length< 10){
        let recetas = await RecetaSchema.find({
            $and: [{
                MomentoDelDia: momento._doc._id,
                Calorias: {$lt: limiteSuperior*2},
                Multiplicable: true
            },{
                MomentoDelDia: momento._doc._id,
                Calorias: {$gt: limiteInferior*2},
                Multiplicable: true
            }]
        }).populate({path: 'Ingredientes',
            populate: {path: 'Ingrediente'} }).populate({path: 'Valores',
            populate:{path: 'ValorNutricional'}}).sort({Puntaje:-1});

        for(let el of recetas){
            let arr=[el,1];
            arreglo.push(arr);
        }
    }

    return [momento,arreglo];
}

async function getMenu(VET, user, date) {
    let recetasMenu = [];
    let momentos = await MomentoDelDiaSchema.find();
    for (let element of momentos) {
        let valor = Math.round(VET * element.Porcentaje);
        let recetas = await getReceta(valor, element);
        let momento = await ControlarRecetas(recetas, user, date);
        recetasMenu.push(momento);
    }

    return  await crearMenu(user,recetasMenu, date);
}

function getVET(user) {
    return new Promise(function (accept) {
        ValorNutricionalSchema.findOne({Nombre: 'Calorias'}).then(function (valor) {
            ValorNutricionalXUsuarioSchema.findOne({Usuario: user, ValorNutricional: valor}).then(function (valorUsuario) {
                accept(valorUsuario.Cantidad);
            })
        })
    })
}

async function Crearmenus(fechaIni,fechaFin,vet,user,){
    let date = fechaIni;
    let menus = [];
    let i = 1;
    do {
        let menu = await MenuSchema.findOne({Fecha: date});
        if (!menu) {
            let menuDia = await getMenu(vet, user, date);
            menus.push(menuDia._id);
        }
        date = moment(fechaIni.toString()).add(i, 'days').format('YYYY-MM-DD');
        i++;
    }while (date <= fechaFin);

    return menus;
}

module.exports = {
    MenuCompleto: async function (req, res) {
        let fechaIni = moment(req.query.FechaInicio).tz('America/Argentina/Cordoba').format('YYYY-MM-DD');
        let fechaFin = moment(req.query.FechaFin).tz('America/Argentina/Cordoba').format('YYYY-MM-DD');
        let user = req.user.id;
        let vet = await getVET(user);
        let menus = Crearmenus(fechaIni,fechaFin,vet,user);
        res.status(200).json(menus);
    },

    informacionMenu: function (req,res) {
        const fecha = moment(req.params.fecha);
        MenuSchema.findOne(
            {Usuario: req.user._id, Fecha: fecha},
            'Calorias Fecha Recetas')
            .populate({
                path: 'Recetas',
                select: 'Receta MomentoDelDia PorcionSugerida',
                populate: {
                    path: 'Receta MomentoDelDia',
                    select: 'Nombre Calorias'
                },
            })
            .then(function (menu){
            res.status(200).json(menu);
        })
    }
};