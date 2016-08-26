var app = module.parent.exports.app;
var Empleado = require('../models/empleados.js');

app.get('/panel/employees', function (req, res) {
    var msg = req.flash('message');
    Empleado.find({}, function (err, docs) {
        res.render('empleados', {title: 'Lista Empleados', persons: docs, flashmsg: msg});
    });
});

app.get('/panel/employees/new', function (req, res) {
    req.flash('message', 'You visited /new');
    res.render('new', {title: 'New'});
});

app.post('/panel/employees/new', function (req, res) {
    console.log(req.body);
    var p = new Empleado({name: req.body.name, lastname: req.body.lastname, email: req.body.email, password: req.body.password});
    console.log(p);
    p.save(function (err, doc) {
        if (!err) {
            res.redirect('/panel/employees');
        } else {
            res.end(err);
        }
    });
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
    req.flash('message', 'You visited /edit');
    Empleado.findOne({_id: req.params.id}, function (err, doc) {
        if (!err) {
            res.render('edit', {title: 'Edit', empleado: doc});
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