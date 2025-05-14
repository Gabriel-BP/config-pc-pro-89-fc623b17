// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DEBUG_FILTERS = process.env.DEBUG_FILTERS === 'true';

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

// Helper function to extract numeric value from a string field
function extractNumericValue(value) {
    if (typeof value === 'number') return value;
    if (!value || typeof value !== 'string') return null;
    
    // Try to extract numbers like "4.70" from strings like "4.70 GHz"
    const match = value.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
}

// Helper function to create a MongoDB pipeline stage for numeric range filtering
function createNumericRangeStage(fieldPaths, minValue, maxValue) {
    const conditions = fieldPaths.map(path => ({
        $let: {
            vars: {
                extractedValue: {
                    $cond: {
                        if: { $eq: [{ $type: `$${path}` }, "number"] },
                        then: `$${path}`,
                        else: {
                            $cond: {
                                if: { $eq: [{ $type: `$${path}` }, "string"] },
                                then: {
                                    $toDouble: {
                                        $replaceAll: {
                                            input: { 
                                                $regexFind: { 
                                                    input: { $ifNull: [`$${path}`, ""] }, 
                                                    regex: /(\d+(\.\d+)?)/ 
                                                }.match 
                                            },
                                            find: " ",
                                            replacement: ""
                                        }
                                    }
                                },
                                else: null
                            }
                        }
                    }
                }
            },
            in: {
                $and: [
                    { $gte: ["$$extractedValue", minValue] },
                    { $lte: ["$$extractedValue", maxValue] }
                ]
            }
        }
    }));

    return { $match: { $or: conditions } };
}

// Route imports
const componentsRoutes = require('./routes/components');
const validationRoutes = require('./routes/validation'); // Nueva importación

// Routes
app.use('/api/components', componentsRoutes);
app.use('/api/validation', validationRoutes); // Nueva ruta

// Configurar el servidor en el puerto especificado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}/api`);
});
