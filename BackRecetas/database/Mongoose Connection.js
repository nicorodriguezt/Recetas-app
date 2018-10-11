'use strict';
var mongoose = require('mongoose');

var URL = "mongodb://nicolasrt:nico1234@ds129393.mlab.com:29393/recetas-app";
mongoose.connect(MONGODB_URI);
module.exports = mongoose;