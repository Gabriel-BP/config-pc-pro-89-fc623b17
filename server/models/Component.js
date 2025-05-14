
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

// Helper function to extract numeric value from a string field
function extractNumericValue(value) {
    if (typeof value === 'number') return value;
    if (!value || typeof value !== 'string') return null;
    
    // Try to extract numbers like "4.70" from strings like "4.70 GHz"
    const match = value.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
}

// Add pre-find middleware to process data before returning
componentSchema.pre('find', function() {
    this.setOptions({ lean: true });
});

// Function to get a component model linked to a collection
function getComponentModel(collectionName) {
    return model(collectionName, componentSchema, collectionName);
}

module.exports = {
    getComponentModel,
    extractNumericValue
};
