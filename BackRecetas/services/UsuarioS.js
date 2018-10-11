'use strict'

var UsuarioSchema = require('../models/Usuario');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
    postRegistro: function (req,res) {
        let params = req.body;

        UsuarioSchema.findOne({$or: [{UserName: params.UserName} , {Email: params.Email}]}).then((userExist) => {
            if(userExist)
                res.status(404).send({message: 'Usuario o Mail ya existente'});
            else{

                let newUser = new UsuarioSchema();
                newUser.UserName = params.UserName;
                newUser.Password = newUser.hashPassword(params.Password);
                newUser.Nombre = params.Nombre;
                newUser.Apellido = params.Apellido;
                newUser.Email = params.Email;

                newUser.save().then((user)=>{
                    req.login(newUser, function (err) {
                        if(err){
                            res.status(500).send(err);
                        }
                    });
                    res.status(200).json(req.session);
                })
            }
        });
    },

    logOut: function (req, res){
        req.logout();
        res.json('Logout exitoso');
    },
    
    update: function (req,res) {
        let params = req.body;
        if(params.Password)
        {
            params.Password = bcrypt.hashSync(params.Password,bcrypt.genSaltSync(10));
        }
        UsuarioSchema.findByIdAndUpdate({ _id: req.session.passport.user }, params, function(err, userUpdated) {
            if (err) {
                res.status(500).send(err);
            }else{
                if(!userUpdated){
                    res.status(404).send({message: 'Usuario no actualizado'});
                }
                else{

                    userUpdated.save(function (err) {
                        if(err) return err;
                        res.redirect('/usuario/info')
                    });

                }
            }
        });
    }
};