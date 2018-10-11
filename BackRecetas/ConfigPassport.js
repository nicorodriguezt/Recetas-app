var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/Usuario');


module.exports = function(passport) {
    passport.serializeUser((User, done) => {
        done(null, User._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, User) {
            done(err, User);
        })
    });

    passport.Autenticado = (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        res.status(401).json('Inicie Sesión');
    };


    passport.use('local-login',new LocalStrategy({
        usernameField: 'UserName',
        passwordField: 'Password'
    },function (username, password, done) {
        User.findOne({UserName: username}).then((doc) => {
            if (doc) {
                var valid = doc.comparePassword(password, doc.Password);
                if (valid) {
                    done(null, doc);
                }
                else{
                    done(null,false, { message: 'Contraseña Incorrecta' });
                }
            }
            else {
                done(null, false, { message: 'No se encontro usuario' });
            }
        })
    }));
};



