'use strict';
var mongoose = require('mongoose');
var URL = "mongodb://localhost/TrabajoFinal";
mongoose.connect(URL);
module.exports = mongoose;