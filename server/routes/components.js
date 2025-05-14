
const express = require('express');
const router = express.Router();
const { getComponentModel, extractNumericValue } = require('../models/Component');

// Constantes para las colecciones
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

// Mostrar detalle de un componente específico
router.get('/:category/:id', async (req, res) => {
    try {
        const { category, id } = req.params;
        
        if (!COLLECTIONS[category]) {
            return res.status(400).json({ error: `Categoría '${category}' no válida` });
        }

        const Component = getComponentModel(COLLECTIONS[category]);
        const component = await Component.findById(id);
        
        if (!component) {
            return res.status(404).json({ error: 'Componente no encontrado' });
        }
        
        res.json(component);
    } catch (err) {
        console.error('Error al obtener el componente:', err);
        res.status(500).json({ error: 'Error del servidor al obtener el componente' });
    }
});

// Listar componentes de una categoría específica con filtros
router.get('/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 100, sort = 'Precios.Nuevos.Precio.valor', order = 'asc', ...filters } = req.query;
        
        if (!COLLECTIONS[category]) {
            return res.status(400).json({ error: `Categoría '${category}' no válida` });
        }
        
        // Debug the query to help troubleshoot
        console.log(`Processing request for ${category} with filters:`, filters);
        
        const Component = getComponentModel(COLLECTIONS[category]);
        
        // For debugging - get total count first
        const totalCount = await Component.countDocuments();
        console.log(`Total documents in ${category} collection: ${totalCount}`);
        
        // Basic query - retrieve all components without complex filters for initial debugging
        const simpleQuery = {};
        const components = await Component.find(simpleQuery).limit(parseInt(limit));
        
        console.log(`Retrieved ${components.length} ${category} components with simple query`);
        
        // Return the components directly instead of a paginated response for now
        // This simplifies the client-side handling
        res.json(components);
        
    } catch (err) {
        console.error('Error al obtener los componentes:', err);
        res.status(500).json({ error: 'Error del servidor al obtener componentes', details: err.message });
    }
});

module.exports = router;
