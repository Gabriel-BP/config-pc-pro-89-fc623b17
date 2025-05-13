
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
            // Filtro general por nombre para todas las categorías
            if (req.query.name) {
                console.log(`Applying name filter: ${req.query.name}`);
                query = { 
                    ...query, 
                    Nombre: { $regex: new RegExp(req.query.name, 'i') } 
                };
            }
            
            // Filtros para CPU
            if (category === 'cpu') {
                // Filtro de marca
                if (req.query.processorBrand) {
                    const brand = req.query.processorBrand.toLowerCase();
                    console.log(`Applying CPU brand filter: ${brand}`);
                    
                    // We need to check both the brand name and the product name as it appears in the database
                    query = { 
                        ...query, 
                        $or: [
                            { Nombre: { $regex: brand, $options: 'i' } },
                            { Marca: { $regex: brand, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de socket
                if (req.query.socket || req.query.enchufe) {
                    const socketValue = req.query.socket || req.query.enchufe;
                    if (socketValue && socketValue !== '') {
                        console.log(`Applying CPU socket filter: ${socketValue}`);
                        // The socket might be in different fields or formats, so we try a more flexible approach
                        query = { 
                            ...query, 
                            $or: [
                                { 'Características.Enchufe': { $regex: socketValue, $options: 'i' } },
                                { 'Características.Socket': { $regex: socketValue, $options: 'i' } }
                            ]
                        };
                    }
                }
                
                // Filtro de núcleos
                if (req.query.nucleos && Array.isArray(req.query.nucleos) && req.query.nucleos.length === 2) {
                    const minCores = parseInt(req.query.nucleos[0]);
                    const maxCores = parseInt(req.query.nucleos[1]);
                    console.log(`Applying CPU cores filter: ${minCores} - ${maxCores}`);
                    
                    // Verificar que Características.Núcleos exista y sea un número dentro del rango
                    query = {
                        ...query,
                        $or: [
                            // Buscar en Características.Núcleos
                            { 'Características.Núcleos': { $gte: minCores, $lte: maxCores } },
                            // Buscar en la raíz del documento donde nucleos es un número
                            { nucleos: { $gte: minCores, $lte: maxCores } }
                        ]
                    };
                }
                
                // Filtro de frecuencia base
                if (req.query.reloj_base && Array.isArray(req.query.reloj_base) && req.query.reloj_base.length === 2) {
                    const minFreq = parseFloat(req.query.reloj_base[0]);
                    const maxFreq = parseFloat(req.query.reloj_base[1]);
                    console.log(`Applying CPU base clock filter: ${minFreq} - ${maxFreq}`);
                    
                    query = {
                        ...query,
                        $or: [
                            // Buscar en Características.Frecuencia base
                            { 'Características.Frecuencia base': { $gte: minFreq, $lte: maxFreq } },
                            // Buscar en la raíz del documento
                            { reloj_base: { $gte: minFreq, $lte: maxFreq } }
                        ]
                    };
                }
                
                // Filtro de TDP
                if (req.query.tdp && Array.isArray(req.query.tdp) && req.query.tdp.length === 2) {
                    const minTDP = parseInt(req.query.tdp[0]);
                    const maxTDP = parseInt(req.query.tdp[1]);
                    console.log(`Applying CPU TDP filter: ${minTDP} - ${maxTDP}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.TDP': { $gte: minTDP, $lte: maxTDP } },
                            { tdp: { $gte: minTDP, $lte: maxTDP } }
                        ]
                    };
                }
                
                // Filtro de cooler incluido
                if (req.query.enfriador_incluido !== undefined) {
                    const hasIncludedCooler = req.query.enfriador_incluido === 'true';
                    console.log(`Applying CPU cooler included filter: ${hasIncludedCooler}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Enfriador incluido': hasIncludedCooler ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i } },
                            { enfriador_incluido: hasIncludedCooler }
                        ]
                    };
                }
                
                // Filtro de GPU integrada
                if (req.query.gpu_integrada !== undefined) {
                    const hasIntegratedGPU = req.query.gpu_integrada === 'true';
                    console.log(`Applying CPU integrated GPU filter: ${hasIntegratedGPU}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.GPU integrada': hasIntegratedGPU ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i } },
                            { gpu_integrada: hasIntegratedGPU }
                        ]
                    };
                }
            }
            
            // Filtros para GPU
            if (category === 'gpu') {
                // Filtro de marca
                if (req.query.gpuBrand) {
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
                                { Nombre: { $regex: /geforce/i } },
                                { Marca: { $regex: /nvidia/i } }
                            ] 
                        };
                    } else if (brand === 'amd') {
                        // For AMD GPUs, search for common AMD product lines
                        query = { 
                            ...query, 
                            $or: [
                                { Nombre: { $regex: /amd/i } },
                                { Nombre: { $regex: /radeon/i } },
                                { Nombre: { $regex: /rx\s?\d/i } }, // Matches RX followed by a digit, with or without space
                                { Marca: { $regex: /amd/i } }
                            ] 
                        };
                    } else {
                        // Fallback to simple brand name matching
                        query = { 
                            ...query, 
                            $or: [
                                { Nombre: { $regex: new RegExp(brand, 'i') } },
                                { Marca: { $regex: new RegExp(brand, 'i') } }
                            ]
                        };
                    }
                }
                
                // Filtro de memoria VRAM
                if (req.query.memoria && Array.isArray(req.query.memoria) && req.query.memoria.length === 2) {
                    const minVRAM = parseInt(req.query.memoria[0]);
                    const maxVRAM = parseInt(req.query.memoria[1]);
                    console.log(`Applying GPU VRAM filter: ${minVRAM} - ${maxVRAM}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Memoria': { $gte: minVRAM, $lte: maxVRAM } },
                            { memoria: { $gte: minVRAM, $lte: maxVRAM } }
                        ]
                    };
                }
                
                // Filtro de longitud de GPU
                if (req.query.longitud && Array.isArray(req.query.longitud) && req.query.longitud.length === 2) {
                    const minLength = parseInt(req.query.longitud[0]);
                    const maxLength = parseInt(req.query.longitud[1]);
                    console.log(`Applying GPU length filter: ${minLength} - ${maxLength}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Longitud': { $gte: minLength, $lte: maxLength } },
                            { longitud: { $gte: minLength, $lte: maxLength } }
                        ]
                    };
                }
                
                // Filtro de tipo de memoria
                if (req.query.tipo_de_memoria && req.query.tipo_de_memoria !== '') {
                    console.log(`Applying GPU memory type filter: ${req.query.tipo_de_memoria}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Tipo de memoria': { $regex: req.query.tipo_de_memoria, $options: 'i' } },
                            { tipo_de_memoria: { $regex: req.query.tipo_de_memoria, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de interfaz
                if (req.query.interfaz && req.query.interfaz !== '') {
                    console.log(`Applying GPU interface filter: ${req.query.interfaz}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Interfaz': { $regex: req.query.interfaz, $options: 'i' } },
                            { interfaz: { $regex: req.query.interfaz, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de TDP
                if (req.query.tdp && Array.isArray(req.query.tdp) && req.query.tdp.length === 2) {
                    const minTDP = parseInt(req.query.tdp[0]);
                    const maxTDP = parseInt(req.query.tdp[1]);
                    console.log(`Applying GPU TDP filter: ${minTDP} - ${maxTDP}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.TDP': { $gte: minTDP, $lte: maxTDP } },
                            { tdp: { $gte: minTDP, $lte: maxTDP } }
                        ]
                    };
                }
            }
            
            // Filtros para Motherboard
            if (category === 'motherboard') {
                // Filtro de factor de forma
                if (req.query.factor_de_forma && req.query.factor_de_forma !== '') {
                    console.log(`Applying motherboard form factor filter: ${req.query.factor_de_forma}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Factor de forma': { $regex: req.query.factor_de_forma, $options: 'i' } },
                            { factor_de_forma: { $regex: req.query.factor_de_forma, $options: 'i' } },
                            { 'Características.Formato': { $regex: req.query.factor_de_forma, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de socket
                if (req.query.socket || req.query.enchufe) {
                    const socketValue = req.query.socket || req.query.enchufe;
                    if (socketValue && socketValue !== '') {
                        console.log(`Applying motherboard socket filter: ${socketValue}`);
                        
                        query = {
                            ...query,
                            $or: [
                                { 'Características.Socket': { $regex: socketValue, $options: 'i' } },
                                { 'Características.Enchufe': { $regex: socketValue, $options: 'i' } },
                                { enchufe: { $regex: socketValue, $options: 'i' } }
                            ]
                        };
                    }
                }
                
                // Filtro de tipo de memoria
                if (req.query.tipo_de_memoria && req.query.tipo_de_memoria !== '') {
                    console.log(`Applying motherboard memory type filter: ${req.query.tipo_de_memoria}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Tipo de memoria': { $regex: req.query.tipo_de_memoria, $options: 'i' } },
                            { tipo_de_memoria: { $regex: req.query.tipo_de_memoria, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de ranuras de RAM
                if (req.query.ranuras_de_ram && Array.isArray(req.query.ranuras_de_ram) && req.query.ranuras_de_ram.length === 2) {
                    const minSlots = parseInt(req.query.ranuras_de_ram[0]);
                    const maxSlots = parseInt(req.query.ranuras_de_ram[1]);
                    console.log(`Applying motherboard RAM slots filter: ${minSlots} - ${maxSlots}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Ranuras de RAM': { $gte: minSlots, $lte: maxSlots } },
                            { ranuras_de_ram: { $gte: minSlots, $lte: maxSlots } }
                        ]
                    };
                }
                
                // Filtro de ranuras M.2
                if (req.query.ranuras_m2 && Array.isArray(req.query.ranuras_m2) && req.query.ranuras_m2.length === 2) {
                    const minSlots = parseInt(req.query.ranuras_m2[0]);
                    const maxSlots = parseInt(req.query.ranuras_m2[1]);
                    console.log(`Applying motherboard M.2 slots filter: ${minSlots} - ${maxSlots}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Ranuras M.2': { $gte: minSlots, $lte: maxSlots } },
                            { ranuras_m2: { $gte: minSlots, $lte: maxSlots } }
                        ]
                    };
                }
                
                // Filtro de WiFi incluido
                if (req.query.redes_inalambricas !== undefined) {
                    const hasWifi = req.query.redes_inalambricas === 'true';
                    console.log(`Applying motherboard WiFi filter: ${hasWifi}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.WiFi': hasWifi ? { $regex: /si|sí|yes|true|incluido|integrado/i } : { $regex: /no|false/i } },
                            { redes_inalambricas: hasWifi }
                        ]
                    };
                }
            }
            
            // Filtros para memoria RAM
            if (category === 'memory') {
                // Filtro de tipo de memoria
                if (req.query.tipo_de_memoria && req.query.tipo_de_memoria !== '') {
                    console.log(`Applying memory type filter: ${req.query.tipo_de_memoria}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Tipo': { $regex: req.query.tipo_de_memoria, $options: 'i' } },
                            { tipo_de_memoria: { $regex: req.query.tipo_de_memoria, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de velocidad
                if (req.query.velocidad && Array.isArray(req.query.velocidad) && req.query.velocidad.length === 2) {
                    const minSpeed = parseInt(req.query.velocidad[0]);
                    const maxSpeed = parseInt(req.query.velocidad[1]);
                    console.log(`Applying memory speed filter: ${minSpeed} - ${maxSpeed}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Velocidad': { $gte: minSpeed, $lte: maxSpeed } },
                            { velocidad: { $gte: minSpeed, $lte: maxSpeed } }
                        ]
                    };
                }
                
                // Filtro de configuración
                if (req.query.configuracion && req.query.configuracion !== '') {
                    console.log(`Applying memory configuration filter: ${req.query.configuracion}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Configuración': { $regex: req.query.configuracion, $options: 'i' } },
                            { configuracion: { $regex: req.query.configuracion, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de refrigeración pasiva
                if (req.query.refrigeracion_pasiva !== undefined) {
                    const hasPassiveCooling = req.query.refrigeracion_pasiva === 'true';
                    console.log(`Applying memory passive cooling filter: ${hasPassiveCooling}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Refrigeración pasiva': hasPassiveCooling ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i } },
                            { refrigeracion_pasiva: hasPassiveCooling }
                        ]
                    };
                }
                
                // Filtro de latencia CAS
                if (req.query.latencia_cas && Array.isArray(req.query.latencia_cas) && req.query.latencia_cas.length === 2) {
                    const minLatency = parseInt(req.query.latencia_cas[0]);
                    const maxLatency = parseInt(req.query.latencia_cas[1]);
                    console.log(`Applying memory CAS latency filter: ${minLatency} - ${maxLatency}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Latencia CAS': { $gte: minLatency, $lte: maxLatency } },
                            { latencia_cas: { $gte: minLatency, $lte: maxLatency } }
                        ]
                    };
                }
            }
            
            // Filtros para almacenamiento
            if (category === 'storage') {
                // Filtro de tipo de almacenamiento
                if (req.query.tipo_de_almacenamiento && req.query.tipo_de_almacenamiento !== '') {
                    console.log(`Applying storage type filter: ${req.query.tipo_de_almacenamiento}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Tipo': { $regex: req.query.tipo_de_almacenamiento, $options: 'i' } },
                            { tipo_de_almacenamiento: { $regex: req.query.tipo_de_almacenamiento, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de capacidad
                if (req.query.capacidad && req.query.capacidad !== '') {
                    console.log(`Applying storage capacity filter: ${req.query.capacidad}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Capacidad': { $regex: req.query.capacidad, $options: 'i' } },
                            { capacidad: { $regex: req.query.capacidad, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de interfaz
                if (req.query.interfaz && req.query.interfaz !== '') {
                    console.log(`Applying storage interface filter: ${req.query.interfaz}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Interfaz': { $regex: req.query.interfaz, $options: 'i' } },
                            { interfaz: { $regex: req.query.interfaz, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de factor de forma
                if (req.query.factor_de_forma && req.query.factor_de_forma !== '') {
                    console.log(`Applying storage form factor filter: ${req.query.factor_de_forma}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Factor de forma': { $regex: req.query.factor_de_forma, $options: 'i' } },
                            { factor_de_forma: { $regex: req.query.factor_de_forma, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de compatibilidad NVMe
                if (req.query.compatibilidad_con_nvme !== undefined) {
                    const isNvmeCompatible = req.query.compatibilidad_con_nvme === 'true';
                    console.log(`Applying storage NVMe compatibility filter: ${isNvmeCompatible}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Compatible con NVMe': isNvmeCompatible ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i } },
                            { compatibilidad_con_nvme: isNvmeCompatible }
                        ]
                    };
                }
            }
            
            // Filtros para fuente de alimentación
            if (category === 'power-supply') {
                // Filtro de potencia
                if (req.query.potencia && Array.isArray(req.query.potencia) && req.query.potencia.length === 2) {
                    const minWattage = parseInt(req.query.potencia[0]);
                    const maxWattage = parseInt(req.query.potencia[1]);
                    console.log(`Applying PSU wattage filter: ${minWattage} - ${maxWattage}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Potencia': { $gte: minWattage, $lte: maxWattage } },
                            { potencia: { $gte: minWattage, $lte: maxWattage } }
                        ]
                    };
                }
                
                // Filtro de certificación
                if (req.query.calificacion_de_eficiencia && req.query.calificacion_de_eficiencia !== '') {
                    console.log(`Applying PSU certification filter: ${req.query.calificacion_de_eficiencia}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Certificación': { $regex: req.query.calificacion_de_eficiencia, $options: 'i' } },
                            { calificacion_de_eficiencia: { $regex: req.query.calificacion_de_eficiencia, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de modularidad
                if (req.query.modular !== undefined) {
                    const isModular = req.query.modular === 'true';
                    console.log(`Applying PSU modularity filter: ${isModular}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Modular': isModular ? { $regex: /si|sí|yes|true|completo|semi/i } : { $regex: /no|false/i } },
                            { modular: isModular }
                        ]
                    };
                }
                
                // Filtro de factor de forma
                if (req.query.factor_de_forma && req.query.factor_de_forma !== '') {
                    console.log(`Applying PSU form factor filter: ${req.query.factor_de_forma}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Factor de forma': { $regex: req.query.factor_de_forma, $options: 'i' } },
                            { factor_de_forma: { $regex: req.query.factor_de_forma, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de longitud
                if (req.query.longitud && Array.isArray(req.query.longitud) && req.query.longitud.length === 2) {
                    const minLength = parseInt(req.query.longitud[0]);
                    const maxLength = parseInt(req.query.longitud[1]);
                    console.log(`Applying PSU length filter: ${minLength} - ${maxLength}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Longitud': { $gte: minLength, $lte: maxLength } },
                            { longitud: { $gte: minLength, $lte: maxLength } }
                        ]
                    };
                }
            }
            
            // Filtros para gabinete
            if (category === 'case') {
                // Filtro de longitud máxima de GPU
                if (req.query.longitud_maxima_de_gpu && Array.isArray(req.query.longitud_maxima_de_gpu) && req.query.longitud_maxima_de_gpu.length === 2) {
                    const minLength = parseInt(req.query.longitud_maxima_de_gpu[0]);
                    const maxLength = parseInt(req.query.longitud_maxima_de_gpu[1]);
                    console.log(`Applying case max GPU length filter: ${minLength} - ${maxLength}`);
                    
                    // For this field, we need to handle that in the database it might be stored as a string like "400 mm"
                    // We'll use a regex to extract just the number
                    query = {
                        ...query,
                        $or: [
                            // Direct numeric comparison if it's stored as a number
                            { longitud_maxima_de_gpu: { $gte: minLength, $lte: maxLength } },
                            // Regex pattern to match strings like "400 mm" and ensure the number is in range
                            { 'Características.Longitud máxima de GPU': { 
                                $regex: new RegExp(`^(${minLength}|${minLength + 1}|.{0,3}${maxLength}).{0,3}mm`, 'i') 
                            }}
                        ]
                    };
                }
                
                // Filtro de factor de forma
                if (req.query.factores_de_forma && req.query.factores_de_forma !== '') {
                    console.log(`Applying case form factor filter: ${req.query.factores_de_forma}`);
                    
                    // Since this might be stored as a comma-separated string
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Factores de forma': { $regex: req.query.factores_de_forma, $options: 'i' } },
                            { factores_de_forma: { $regex: req.query.factores_de_forma, $options: 'i' } }
                        ]
                    };
                }
                
                // Filtro de ranuras de expansión
                if (req.query.ranuras_de_expansion && req.query.ranuras_de_expansion !== '') {
                    console.log(`Applying case expansion slots filter: ${req.query.ranuras_de_expansion}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Ranuras de expansión de altura completa': { $regex: req.query.ranuras_de_expansion, $options: 'i' } },
                            { ranuras_de_expansion_de_altura: { $regex: req.query.ranuras_de_expansion, $options: 'i' } }
                        ]
                    };
                }
            }
            
            // Filtros para refrigeración
            if (category === 'cooler') {
                // Filtro de refrigeración líquida
                if (req.query.refrigerado_por_agua !== undefined) {
                    const isLiquidCooled = req.query.refrigerado_por_agua === 'true';
                    console.log(`Applying cooler liquid cooling filter: ${isLiquidCooled}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Refrigerado por agua': isLiquidCooled ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i } },
                            { refrigerado_por_agua: isLiquidCooled }
                        ]
                    };
                }
                
                // Filtro de enfriamiento pasivo
                if (req.query.sin_ventilador !== undefined) {
                    const isPassiveCooling = req.query.sin_ventilador === 'true';
                    console.log(`Applying cooler passive cooling filter: ${isPassiveCooling}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Sin ventilador': isPassiveCooling ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i } },
                            { sin_ventilador: isPassiveCooling }
                        ]
                    };
                }
                
                // Filtro de ruido máximo
                if (req.query.ruido_maximo && Array.isArray(req.query.ruido_maximo) && req.query.ruido_maximo.length === 2) {
                    const minNoise = parseInt(req.query.ruido_maximo[0]);
                    const maxNoise = parseInt(req.query.ruido_maximo[1]);
                    console.log(`Applying cooler max noise filter: ${minNoise} - ${maxNoise}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Ruido máximo': { $gte: minNoise, $lte: maxNoise } },
                            { ruido_maximo: { $gte: minNoise, $lte: maxNoise } }
                        ]
                    };
                }
                
                // Filtro de RPM máximas
                if (req.query.rpm_maximas && Array.isArray(req.query.rpm_maximas) && req.query.rpm_maximas.length === 2) {
                    const minRPM = parseInt(req.query.rpm_maximas[0]);
                    const maxRPM = parseInt(req.query.rpm_maximas[1]);
                    console.log(`Applying cooler max RPM filter: ${minRPM} - ${maxRPM}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.RPM máximas': { $gte: minRPM, $lte: maxRPM } },
                            { rpm_maximas: { $gte: minRPM, $lte: maxRPM } }
                        ]
                    };
                }
                
                // Filtro de longitud del radiador
                if (req.query.longitud_del_radiador && Array.isArray(req.query.longitud_del_radiador) && req.query.longitud_del_radiador.length === 2) {
                    const minLength = parseInt(req.query.longitud_del_radiador[0]);
                    const maxLength = parseInt(req.query.longitud_del_radiador[1]);
                    console.log(`Applying cooler radiator length filter: ${minLength} - ${maxLength}`);
                    
                    query = {
                        ...query,
                        $or: [
                            { 'Características.Longitud del radiador': { $gte: minLength, $lte: maxLength } },
                            { longitud_del_radiador: { $gte: minLength, $lte: maxLength } }
                        ]
                    };
                }
            }
        }

        console.log('Final query filters:', JSON.stringify(query));
        
        // Leemos la colección con los filtros aplicados
        const items = await mongoose.connection.db
            .collection(collName)
            .find(query)
            .toArray();
            
        console.log(`Encontrados ${items.length} componentes en ${collName}`);
        
        // Si no hay resultados y hay filtros aplicados, intenta un query simplificado
        if (items.length === 0 && Object.keys(query).length > 0) {
            console.log('No se encontraron resultados con los filtros. Realizando un diagnóstico...');
            
            // Mostrar una muestra de documentos para ver su estructura
            const sampleDocs = await mongoose.connection.db
                .collection(collName)
                .find({})
                .limit(1)
                .toArray();
                
            if (sampleDocs.length > 0) {
                console.log('Muestra de estructura de documento:', JSON.stringify(sampleDocs[0]));
            }
        }
        
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

