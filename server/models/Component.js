const { Schema, model } = require('mongoose');

const priceSchema = new Schema({
    valor: Number,
    moneda: String
}, { _id: false });

const priceInfoSchema = new Schema({
    Cantidad: Number,
    Precio: priceSchema
}, { _id: false });

const pricesSchema = new Schema({
    Nuevos: priceInfoSchema,
    Utilizados: priceInfoSchema
}, { _id: false });

const componentSchema = new Schema({
    Nombre: String,
    Marca: String,
    Características: { type: Map, of: String },
    Precios: pricesSchema,
    categoria: String,
    URL: String
}, { collection: '' }); // La colección se inyectará dinámicamente

// Función helper para obtener un modelo ligado a una colección
function getComponentModel(collectionName) {
    return model(collectionName, componentSchema, collectionName);
}
