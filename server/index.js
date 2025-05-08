
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
        // Log all incoming filter parameters for debugging
        console.log('Received query params:', req.query);
        
        // Construir el query basado en los filtros recibidos
        let query = {};
        
        // Aplicar filtros específicos según la categoría
        if (req.query) {
            // Filtros para CPU
            if (category === 'cpu' && req.query.processorBrand) {
                const brand = req.query.processorBrand.toLowerCase();
                console.log(`Applying CPU brand filter: ${brand}`);
                // For CPU we search in the Nombre field since it contains the brand
                query = { ...query, Nombre: { $regex: new RegExp(brand, 'i') } };
                console.log('CPU Brand query:', JSON.stringify(query));
            }
            
            if (category === 'cpu' && req.query.socket) {
                console.log(`Applying CPU socket filter: ${req.query.socket}`);
                // Look for exact socket match in Características.Enchufe
                query = { 
                    ...query, 
                    'Características.Enchufe': req.query.socket
                };
                console.log('CPU Socket query:', JSON.stringify(query));
            }
            
            // Filtros para GPU
            if (category === 'gpu' && req.query.gpuBrand) {
                const brand = req.query.gpuBrand.toLowerCase();
                console.log(`Applying GPU brand filter: ${brand}`);
                
                if (brand === 'nvidia') {
                    // For NVIDIA GPUs, search for common NVIDIA product lines
                    query = { 
                        ...query, 
                        $or: [
                            { Nombre: { $regex: /nvidia/i } },
                            { Nombre: { $regex: /rtx/i } },
                            { Nombre: { $regex: /gtx/i } },
                            { Nombre: { $regex: /quadro/i } },
                            { Nombre: { $regex: /geforce/i } }
                        ] 
                    };
                } else if (brand === 'amd') {
                    // For AMD GPUs, search for common AMD product lines
                    query = { 
                        ...query, 
                        $or: [
                            { Nombre: { $regex: /amd/i } },
                            { Nombre: { $regex: /radeon/i } },
                            { Nombre: { $regex: /rx\s?\d/i } } // Matches RX followed by a digit, with or without space
                        ] 
                    };
                } else {
                    // Fallback to simple brand name matching
                    query = { ...query, Nombre: { $regex: new RegExp(brand, 'i') } };
                }
                console.log('GPU Brand query:', JSON.stringify(query));
            }
            
            // Filtros para Motherboard
            if (category === 'motherboard' && req.query.motherboardSize) {
                console.log(`Applying motherboard size filter: ${req.query.motherboardSize}`);
                // Use exact match for Factor de forma
                query = { 
                    ...query, 
                    'Características.Factor de forma': req.query.motherboardSize
                };
                console.log('Motherboard size query:', JSON.stringify(query));
            }
            
            // Si hay socket seleccionado, filtrar placas base compatibles
            if (category === 'motherboard' && req.query.socket) {
                console.log(`Applying motherboard socket filter: ${req.query.socket}`);
                query = { 
                    ...query, 
                    'Características.Enchufe': req.query.socket
                };
                console.log('Motherboard socket query:', JSON.stringify(query));
            }
            
            // Parse other filter params (from FilterPanel)
            if (req.query.name) {
                console.log(`Applying name filter: ${req.query.name}`);
                query = { ...query, Nombre: { $regex: new RegExp(req.query.name, 'i') } };
            }
        }

        console.log('Final query filters:', JSON.stringify(query));
        
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
