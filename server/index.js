
// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const COLLECTIONS = {
    case: 'productos_procesados/case_productos',
    cpu: 'productos_procesados/processor_productos',
    gpu: 'productos_procesados/graphic-card_productos',
    memory: 'productos_procesados/memory_productos',
    motherboard: 'productos_procesados/motherboard_productos',
    'power-supply': 'productos_procesados/power-supply_productos',
    storage: 'productos_procesados/storage_productos',
    cooler: 'productos_procesados/cooler_productos',
};

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));

app.get('/api/components/:category', async (req, res) => {
    const { category } = req.params;
    const collName = COLLECTIONS[category];
    if (!collName) {
        return res.status(404).json({ error: 'Categoría no válida' });
    }
    
    try {
        // Construir el query basado en los filtros recibidos
        let query = {};
        
        // Aplicar filtros específicos según la categoría
        if (req.query) {
            // Filtros para CPU
            if (category === 'cpu' && req.query.processorBrand) {
                query = { ...query, Marca: { $regex: new RegExp(req.query.processorBrand, 'i') } };
            }
            
            if (category === 'cpu' && req.query.socket) {
                query = { 
                    ...query, 
                    'Características.Socket': { $regex: new RegExp(req.query.socket, 'i') } 
                };
            }
            
            // Filtros para GPU
            if (category === 'gpu' && req.query.gpuBrand) {
                query = { ...query, Marca: { $regex: new RegExp(req.query.gpuBrand, 'i') } };
            }
            
            // Filtros para Motherboard
            if (category === 'motherboard' && req.query.motherboardSize) {
                query = { 
                    ...query, 
                    'Características.Factor de forma': { $regex: new RegExp(req.query.motherboardSize, 'i') }
                };
            }
            
            // Si hay socket seleccionado, filtrar placas base compatibles
            if (category === 'motherboard' && req.query.socket) {
                query = { 
                    ...query, 
                    'Características.Socket': { $regex: new RegExp(req.query.socket, 'i') } 
                };
            }
        }

        console.log('Aplicando filtros:', query);
        
        // Leemos la colección con los filtros aplicados
        const items = await mongoose.connection.db
            .collection(collName)
            .find(query)
            .toArray();
            
        console.log(`Encontrados ${items.length} componentes en ${collName}`);
        res.json(items);
    } catch (err) {
        console.error('🔥 Error al consultar la colección', collName, err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}/api`);
});
