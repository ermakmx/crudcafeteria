var express = require('express');

var app = express();

app.get('/', function(req, res, next) {
    res.status(200).json({
        ok: true,
        mensaje: 'funciona peticion'

    });
});


module.exports = app;