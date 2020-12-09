var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');




mongoose.set('useCreateIndex', true);
mongoose.connection.openUri('mongodb://localhost:27017/cafeteriadb', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {

    if (err) throw err;
    console.log('Base de datos conectada');

});


app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

app.listen(5000, () => {

    console.log('server en puerto 5000 online');

});