var express = require('express');
var mongoose = require('mongoose');



var app = express();
mongoose.connection.openUri('mongodb://localhost:27017/cafeteriadb', (err, res) => {

    if (err) throw err;
    console.log('Base de datos conectada');

});


app.get('/', function(req, res) {
    res.send('<h1>Bienvenido al servidor Rest<h1>')
});


app.listen(5000, () => {

    console.log('server en puerto 5000 online');

});