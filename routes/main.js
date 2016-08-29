var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var Empleado = require('../models/empleados.js');
var Admins = require('../models/admins.js');

app.get('/', function(req, res){
   res.redirect('/busqueda'); 
});

app.get('/busqueda', function (req, res) {
    res.render('busqueda', {title: 'Buscador empleados'});
});

app.get('/admin', function (req, res) {
    res.render('admin', {title: 'Login'});
});

app.post('/admin', passport.authenticate('AdminLogin',
        {successRedirect: '/panel/employees',
            failureRedirect: '/badlogin',
            failureFlash: true}));

app.get('/panel/employees', function (req, res) {
    var msg = req.flash('message');
    Empleado.find({}, function (err, docs) {
        res.render('empleados', {title: 'Lista Empleados', persons: docs, flashmsg: msg});
    });
});

app.get('/panel/employees/new', function (req, res) {
    res.render('new', {title: 'Alta empleado'});
});

app.post('/panel/employees/new', function (req, res) {
    console.log(req.body);
    var emailStr = req.body.email;
    var pass = req.body.password;
    var confirm = req.body.confirm;

    console.log("Pass: " + pass + " Confirm: " + confirm);

    if (!emailStr.includes('@') || !emailStr.includes(".com")) {
        req.flash('message', 'E-Mail Incorrecto');
        var msg = req.flash('message');
        res.render('new', {title: 'New', flashmsg: msg});
    } else if (pass === confirm) {
        var p = new Empleado({name: req.body.name, lastname: req.body.lastname, email: req.body.email, password: req.body.password});
        console.log(p);
        p.save(function (err, doc) {
            if (!err) {
                req.flash('message', 'Empleado creado correctamente.');
                res.redirect('/panel/employees');
            } else {
                res.end(err);
            }
        });
    } else {
        req.flash('message', 'Password distintos');
        var msg = req.flash('message');
        res.render('new', {title: 'Alta Empleado', flashmsg: msg});
    }
});

app.get('/panel/employees/delete/:id', function (req, res) {
    req.flash('message', 'You visited /delete');
    Empleado.remove({_id: req.params.id}, function (err, doc) {
        if (!err) {
            res.redirect('/panel/employees');
        } else {
            res.end(err);
        }
    });
});

app.get('/panel/employees/edit/:id', function (req, res) {
    Empleado.findOne({_id: req.params.id}, function (err, doc) {
        if (!err) {
            res.render('edit', {title: 'Editar Empleado', empleado: doc});
        } else {
            res.end(err);
        }
    });
});

app.post('/panel/employees/edit/:id', function (req, res) {
    Empleado.findOne({_id: req.params.id}, function (err, doc) {
        if (!err) {
            doc.name = req.body.name;
            doc.lastname = req.body.lastname;
            doc.email = req.body.email;
            doc.password = req.body.password;
            doc.save(function (err, doc) {
                if (!err) {
                    req.flash('message', 'Empleado editado correctamente');
                    res.redirect('/panel/employees');
                } else {
                    res.end(err);
                }
            });
        } else {
            res.end(err);
        }
    });
});

app.get('/employee/search/:id', function (req, res) {
    Empleado.find({}, function (err, docs) {
        var key = req.params.id.toString();
        var resultados = [];
        docs.forEach(function (v, i) {
            if ((v.name.toLowerCase().includes(key.toLowerCase())) ||
                    (v.lastname.toLowerCase().includes(key.toLowerCase()))) {
                resultados.push({name: v.name, lastname: v.lastname, email: v.email});
            }

        });
        res.render('empleados', {title: 'Lista Empleados', persons: resultados});
    });
});

app.get('*', function (req, res) {
    console.error("Controlador error");
    res.render('error', {message: "Página no encontrada."});
});