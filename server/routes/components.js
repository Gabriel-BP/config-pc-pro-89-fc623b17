
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
        const { page = 1, limit = 10, sort = 'Precios.Nuevos.Precio.valor', order = 'asc', ...filters } = req.query;
        
        if (!COLLECTIONS[category]) {
            return res.status(400).json({ error: `Categoría '${category}' no válida` });
        }
        
        const Component = getComponentModel(COLLECTIONS[category]);
        
        // Construir la query de filtros
        const mongoQuery = {};
        const aggregatePipeline = [];
        
        // Procesamiento de filtros
        Object.keys(filters).forEach(key => {
            if (key === 'priceRange') {
                const [min, max] = filters.priceRange.split('-').map(Number);
                
                if (!isNaN(min) && !isNaN(max)) {
                    aggregatePipeline.push({
                        $match: {
                            $or: [
                                { 'Precios.Nuevos.Precio.valor': { $gte: min, $lte: max } },
                                { 'Precios.Utilizados.Precio.valor': { $gte: min, $lte: max } }
                            ]
                        }
                    });
                }
            } else if (key.endsWith('Range')) {
                // Manejo de rangos para campos como 'clockSpeedRange'
                const fieldName = key.replace('Range', '');
                const [min, max] = filters[key].split('-').map(Number);
                
                if (!isNaN(min) && !isNaN(max)) {
                    // Determina los campos donde buscar este valor
                    let fieldPaths = [];
                    
                    // Mapeo de nombres de campos según la categoría
                    switch (fieldName) {
                        case 'clockSpeed':
                            if (category === 'cpu') {
                                fieldPaths = ['Características.Frecuencia base', 'Características.Clock Speed'];
                            } else if (category === 'gpu') {
                                fieldPaths = ['Características.GPU Clock', 'Características.Velocidad'];
                            } else if (category === 'memory') {
                                fieldPaths = ['Características.Speed', 'Características.Velocidad'];
                            }
                            break;
                        case 'cores':
                            fieldPaths = ['Características.Núcleos', 'Características.Cores'];
                            break;
                        case 'memory':
                            fieldPaths = ['Características.Memory Size', 'Características.Capacidad'];
                            break;
                        case 'capacity':
                            fieldPaths = ['Características.Capacity', 'Características.Capacidad'];
                            break;
                        case 'wattage':
                            fieldPaths = ['Características.Wattage', 'Características.Potencia'];
                            break;
                        default:
                            fieldPaths = [`Características.${fieldName}`];
                    }
                    
                    if (fieldPaths.length > 0) {
                        aggregatePipeline.push(createNumericRangeStage(fieldPaths, min, max));
                    }
                }
            } else if (key === 'brands') {
                // Filtro de marcas
                const brands = filters.brands.split(',');
                mongoQuery.Marca = { $in: brands };
            } else if (key === 'socket' && category === 'cpu') {
                // Filtro de socket para CPUs
                mongoQuery['Características.Socket'] = filters.socket;
            } else if (key === 'socket' && category === 'motherboard') {
                // Filtro de socket para placas madre
                mongoQuery['Características.CPU Socket'] = filters.socket;
            } else if (key === 'chipset' && category === 'motherboard') {
                // Filtro de chipset
                mongoQuery['Características.Chipset'] = filters.chipset;
            } else if (key === 'search') {
                // Búsqueda por texto
                mongoQuery.$or = [
                    { Nombre: { $regex: filters.search, $options: 'i' } },
                    { Marca: { $regex: filters.search, $options: 'i' } }
                ];
            } else if (key === 'formFactor' && (category === 'motherboard' || category === 'case')) {
                // Filtro de factor de forma
                const formFactorKey = category === 'motherboard' ? 'Características.Form Factor' : 'Características.Tipo';
                mongoQuery[formFactorKey] = filters.formFactor;
            }
        });
        
        // Agregar el filtro MongoDB a la pipeline
        if (Object.keys(mongoQuery).length > 0) {
            aggregatePipeline.push({ $match: mongoQuery });
        }
        
        const DEBUG_FILTERS = process.env.DEBUG_FILTERS === 'true';
        if (DEBUG_FILTERS) {
            console.log('📋 MongoDB Query:', JSON.stringify(mongoQuery, null, 2));
            console.log('📋 Aggregate Pipeline:', JSON.stringify(aggregatePipeline, null, 2));
        }
        
        // Configurar paginación
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Añadir etapas de ordenación y paginación a la pipeline
        let sortDirection = order === 'desc' ? -1 : 1;
        let sortField = sort;
        
        // Ajustar el ordenamiento si es por precio y asegurar que los productos sin precio aparezcan al final
        if (sortField.includes('Precio')) {
            aggregatePipeline.push({
                $addFields: {
                    sortPrice: {
                        $cond: {
                            if: { $gt: [`$${sortField}`, 0] },
                            then: `$${sortField}`,
                            else: order === 'desc' ? 0 : 999999999 // Un valor extremo para que aparezca al final
                        }
                    }
                }
            });
            sortField = 'sortPrice';
        }
        
        aggregatePipeline.push(
            { $sort: { [sortField]: sortDirection } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        );
        
        // Ejecutar la consulta con todos los filtros
        const components = await Component.aggregate(aggregatePipeline);
        
        // Obtener el total de documentos que coinciden con el filtro (para paginación)
        const countPipeline = [...aggregatePipeline];
        // Eliminar las etapas de ordenación y paginación
        countPipeline.splice(-2); // Elimina $skip y $limit
        if (sortField === 'sortPrice') {
            countPipeline.splice(-1); // Elimina también $addFields si se agregó para sortPrice
        }
        countPipeline.push({ $count: 'total' });
        
        const countResult = await Component.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;
        
        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            data: components
        });
    } catch (err) {
        console.error('Error al obtener los componentes:', err);
        res.status(500).json({ error: 'Error del servidor al obtener componentes', details: err.message });
    }
});

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

module.exports = router;
