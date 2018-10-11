'use strict';
var mongoose = require('mongoose');
var URL = "mongodb://nicorodriguezt:nicolas_2995@ds129393.mlab.com:29393/recetas-app";
mongoose.connect(URL);
module.exports = mongoose;