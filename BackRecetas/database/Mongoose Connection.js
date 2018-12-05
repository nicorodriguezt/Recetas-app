'use strict';
var mongoose = require('mongoose');

var URL = "mongodb://leanco:6yCrC7CVnd9RXck@ds121311.mlab.com:21311/db-recetas";
mongoose.connect(URL);
module.exports = mongoose;