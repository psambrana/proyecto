var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
    console.log("Busqueda");
  res.render('busqueda', { title: 'Busqueda empleados' });
});

module.exports = router;
