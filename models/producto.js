var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'El id categoria es un campo obligatorio']
    },
    disponible: {
        type: Boolean,
        default: true

    }
});

module.exports = mongoose.model('Producto', productoSchema);