// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const {
    buildProcessorFilters,
    buildGPUFilters,
    buildMotherboardFilters,
    buildMemoryFilters,
    buildStorageFilters,
    buildPSUFilters,
    buildCaseFilters,
    buildCoolerFilters
  } = require('./backend_filter_adapters');
  

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de parseo de arrays y booleans
app.use((req, res, next) => {
    Object.keys(req.query).forEach(key => {
        try {
            if (typeof req.query[key] === 'string' && req.query[key].startsWith('[')) {
                req.query[key] = JSON.parse(req.query[key]);
            }
        } catch (error) {
            console.error(`Error parsing query param ${key}:`, error);
        }
    });
    next();
});

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
        console.log('Received query params:', req.query);

        let query = {};

        // Filtro global de nombre
        if (req.query.name) {
            query.Nombre = { $regex: new RegExp(req.query.name, 'i') };
        }

        // Filtros por categoría adaptados
        switch (category) {
            case 'cpu':
                query = { ...query, ...buildProcessorFilters(req.query) };
                break;
            case 'gpu':
                query = { ...query, ...buildGPUFilters(req.query) };
                break;
            case 'motherboard':
                query = { ...query, ...buildMotherboardFilters(req.query) };
                break;
            case 'memory':
                query = { ...query, ...buildMemoryFilters(req.query) };
                break;
            case 'storage':
                query = { ...query, ...buildStorageFilters(req.query) };
                break;
            case 'power-supply':
                query = { ...query, ...buildPSUFilters(req.query) };
                break;
            case 'case':
                query = { ...query, ...buildCaseFilters(req.query) };
                break;
            case 'cooler':
                query = { ...query, ...buildCoolerFilters(req.query) };
                break;
            default:
                break;
        }

        console.log("Final query filters:", JSON.stringify(query, null, 2));

        const items = await mongoose.connection.db.collection(collName).find(query).toArray();
        console.log(`Encontrados ${items.length} componentes en ${collName}`);
        res.json(items);
    } catch (error) {
        console.error("🔥 Error al consultar la colección", collName, error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/validate', require('./validate'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}/api`);
});
