var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var Mongoose = require('./database/Mongoose Connection');
require('./ConfigPassport')(passport);

cors = require('cors');

var corsOptions ={
    'origin': true,
    'methods': 'GEt,HEAD,PUT,PATCH,POST,DELETE',
    'credentials': true,
    'optionSuccessStatus':204,
};



//Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usuarioRouter = require('./routes/controllers/UsuarioC')(passport);
var datosUsuarioRouter = require('./routes/controllers/DatosUsuarioC')(passport);
var actividadFisicaXUsuarioRouter = require('./routes/controllers/ActividadFisicaXUsuarioC')(passport);
var valorNutricionalXUsuarioRouter = require('./routes/controllers/ValorNutricionalXUsuarioC')(passport);
var ingredienteRouter = require('./routes/controllers/IngredienteC')(passport);
var recetaRouter = require('./routes/controllers/RecetaC')(passport);
var menuRouter = require('./routes/controllers/MenuC')(passport);

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Set Uses
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors(corsOptions));

app.use(session({
    secret: 'secretseccionconf',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: Mongoose.connection
    }),
    cookie: {expires: new Date(253402300000000)}
}));
app.use(passport.initialize());
app.use(passport.session());


//Route Creations
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/usuario', usuarioRouter);
app.use('/usuario/datos', datosUsuarioRouter);
app.use('/usuario/datos/actividadfisica', actividadFisicaXUsuarioRouter);
app.use('/usuario/valornutricional', valorNutricionalXUsuarioRouter);
app.use('/menu', menuRouter);
app.use('/ingrediente', ingredienteRouter);
app.use('/receta', recetaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
