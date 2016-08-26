var Empleado = require('../models/empleados');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/empleados');

var p = new Empleado({ name:"Cristian", lastname:"Cortez", email:"cristiancortes@mail.com", password: "123456" });
p.save(function(err, doc){
    console.log(err, doc);    
});