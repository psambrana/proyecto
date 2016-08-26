var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var empleadoSchema = new Schema({
    name: String,
    lastname: String,
    email: String,
    password: String
});

var empleadoModel = mongoose.model('Empleados', empleadoSchema);

module.exports = empleadoModel;