// backend_filter_adapters.js

function buildProcessorFilters(query) {
    const filters = {};
    if (query.nucleos) {
        filters["Características.Núcleos"] = { $gte: query.nucleos[0], $lte: query.nucleos[1] };
    }
    if (query.tdp) {
        filters["Características.TDP"] = { $gte: `${query.tdp[0]} W`, $lte: `${query.tdp[1]} W` };
    }
    if (query.reloj_base) {
        filters["Características.Reloj base"] = { $gte: `${query.reloj_base[0]} GHz`, $lte: `${query.reloj_base[1]} GHz` };
    }
    if (query.enfriador_incluido) {
        filters["Características.Enfriador incluido"] = query.enfriador_incluido === 'true' ? { $ne: "No" } : "No";
    }
    if (query.gpu_integrada) {
        filters["Características.GPU integrada"] = query.gpu_integrada === 'true' ? { $ne: "", $exists: true } : { $in: ["", null] };
    }
    if (query.enchufe) {
        filters["Características.Enchufe"] = query.enchufe;
    }
    return filters;
}

function buildGPUFilters(query) {
    const filters = {};
    if (query.memoria) {
        filters["Características.Memoria"] = { $gte: query.memoria[0], $lte: query.memoria[1] };
    }
    if (query.tdp) {
        filters["Características.TDP"] = { $gte: query.tdp[0], $lte: query.tdp[1] };
    }
    if (query.longitud) {
        filters["Características.Longitud"] = { $gte: query.longitud[0], $lte: query.longitud[1] };
    }
    if (query.tipo_de_memoria) {
        filters["Características.Tipo de memoria"] = { $regex: query.tipo_de_memoria, $options: 'i' };
    }
    if (query.interfaz) {
        filters["Características.Interfaz"] = { $regex: query.interfaz, $options: 'i' };
    }
    return filters;
}

function buildMotherboardFilters(query) {
    const filters = {};
    if (query.ranuras_de_ram) {
        filters["Características.Ranuras de RAM"] = { $gte: query.ranuras_de_ram[0], $lte: query.ranuras_de_ram[1] };
    }
    if (query.ranuras_m2) {
        filters["Características.Ranuras M.2"] = { $gte: query.ranuras_m2[0], $lte: query.ranuras_m2[1] };
    }
    if (query.tipo_de_memoria) {
        filters["Características.Tipo de memoria"] = { $regex: query.tipo_de_memoria, $options: 'i' };
    }
    if (query.factor_de_forma) {
        filters["Características.Factor de forma"] = { $regex: query.factor_de_forma, $options: 'i' };
    }
    if (query.enchufe) {
        filters["Características.Enchufe"] = { $regex: query.enchufe, $options: 'i' };
    }
    if (query.redes_inalambricas) {
        filters["Características.Redes inalámbricas"] = query.redes_inalambricas === 'true' ? { $ne: "None" } : { $in: ["None", ""] };
    }
    return filters;
}

function buildMemoryFilters(query) {
    const filters = {};
    if (query.velocidad) {
        filters["Características.Velocidad"] = { $gte: query.velocidad[0], $lte: query.velocidad[1] };
    }
    if (query.latencia_cas) {
        filters["Características.Latencia CAS"] = { $gte: query.latencia_cas[0], $lte: query.latencia_cas[1] };
    }
    if (query.tipo_de_memoria) {
        filters["Características.Tipo de memoria"] = { $regex: query.tipo_de_memoria, $options: 'i' };
    }
    if (query.configuracion) {
        filters["Características.Configuración"] = { $regex: query.configuracion, $options: 'i' };
    }
    if (query.refrigeracion_pasiva) {
        filters["Características.Refrigeración pasiva"] = query.refrigeracion_pasiva === 'true' ? { $ne: "No" } : "No";
    }
    return filters;
}

function buildStorageFilters(query) {
    const filters = {};
    if (query.tipo_de_almacenamiento) {
        filters["Características.Tipo de almacenamiento"] = { $regex: query.tipo_de_almacenamiento, $options: 'i' };
    }
    if (query.capacidad) {
        filters["Características.Capacidad"] = { $regex: query.capacidad, $options: 'i' };
    }
    if (query.interfaz) {
        filters["Características.Interfaz"] = { $regex: query.interfaz, $options: 'i' };
    }
    if (query.factor_de_forma) {
        filters["Características.Factor de forma"] = { $regex: query.factor_de_forma, $options: 'i' };
    }
    if (query.compatibilidad_con_nvme) {
        filters["Características.Compatibilidad con NVMe"] = query.compatibilidad_con_nvme === 'true' ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i };
    }
    return filters;
}

function buildPSUFilters(query) {
    const filters = {};
    if (query.potencia) {
        filters["Características.Potencia"] = { $gte: query.potencia[0], $lte: query.potencia[1] };
    }
    if (query.calificacion_de_eficiencia) {
        filters["Características.Calificación de eficiencia"] = { $regex: query.calificacion_de_eficiencia, $options: 'i' };
    }
    if (query.modular) {
        filters["Características.Modular"] = query.modular === 'true' ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i };
    }
    if (query.factor_de_forma) {
        filters["Características.Factor de forma"] = { $regex: query.factor_de_forma, $options: 'i' };
    }
    if (query.longitud) {
        filters["Características.Longitud"] = { $gte: query.longitud[0], $lte: query.longitud[1] };
    }
    return filters;
}

function buildCaseFilters(query) {
    const filters = {};
    if (query.longitud_maxima_de_gpu) {
        filters["Características.Longitud máxima de GPU"] = { $gte: query.longitud_maxima_de_gpu[0], $lte: query.longitud_maxima_de_gpu[1] };
    }
    if (query.factores_de_forma) {
        filters["Características.Factores de forma"] = { $regex: query.factores_de_forma, $options: 'i' };
    }
    if (query.ranuras_de_expansion) {
        filters["Características.Ranuras de expansión de altura completa"] = { $regex: query.ranuras_de_expansion, $options: 'i' };
    }
    return filters;
}

function buildCoolerFilters(query) {
    const filters = {};
    if (query.ruido_maximo) {
        filters["Características.Ruido máximo"] = { $gte: query.ruido_maximo[0], $lte: query.ruido_maximo[1] };
    }
    if (query.rpm_maximas) {
        filters["Características.RPM máximas"] = { $gte: query.rpm_maximas[0], $lte: query.rpm_maximas[1] };
    }
    if (query.refrigerado_por_agua) {
        filters["Características.Refrigerado por agua"] = query.refrigerado_por_agua === 'true' ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i };
    }
    if (query.sin_ventilador) {
        filters["Características.Sin ventilador"] = query.sin_ventilador === 'true' ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i };
    }
    if (query.longitud_del_radiador) {
        filters["Características.Longitud del radiador"] = { $gte: query.longitud_del_radiador[0], $lte: query.longitud_del_radiador[1] };
    }
    return filters;
}

module.exports = {
    buildProcessorFilters,
    buildGPUFilters,
    buildMotherboardFilters,
    buildMemoryFilters,
    buildStorageFilters,
    buildPSUFilters,
    buildCaseFilters,
    buildCoolerFilters,
};