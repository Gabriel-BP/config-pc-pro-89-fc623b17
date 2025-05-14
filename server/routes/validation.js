
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.post('/validate-build', (req, res) => {
  const { components } = req.body;
  
  if (!components || !Array.isArray(components) || components.length === 0) {
    return res.status(400).json({ error: 'Se requiere una lista de componentes' });
  }

  // Convierte el array de componentes a un formato que Python pueda entender (string JSON)
  const componentsJSON = JSON.stringify(components);
  
  // Inicia el proceso de Python
  const pythonProcess = spawn('python3', [
    path.join(__dirname, '../neo4j_validation.py'),
    componentsJSON
  ]);

  let result = '';
  let error = '';

  // Captura la salida del script
  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  // Captura errores
  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  // Cuando el proceso termina
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Error del script de Python:', error);
      return res.status(500).json({ 
        error: 'Error al ejecutar la validación',
        details: error
      });
    }

    try {
      // Parsear la salida para extraer información relevante
      const isValid = !result.includes('Configuración inválida');
      const errors = [];
      const details = [];

      // Extraer detalles y errores
      if (result.includes('🔍 Detalle de validaciones:')) {
        const detailsSection = result.split('🔍 Detalle de validaciones:')[1];
        if (detailsSection) {
          const detailLines = detailsSection.split('\n').filter(line => line.trim().startsWith('✔') || line.trim().startsWith('⚠'));
          details.push(...detailLines.map(line => line.trim()));
        }
      }

      if (result.includes('Configuración inválida:')) {
        const errorsSection = result.split('Configuración inválida:')[1];
        if (errorsSection) {
          const errorLines = errorsSection.split('\n').filter(line => line.trim().startsWith(' - '));
          errors.push(...errorLines.map(line => line.trim().substring(3)));
        }
      }

      res.json({
        isValid,
        errors,
        details,
        rawOutput: result
      });
    } catch (e) {
      console.error('Error al procesar la respuesta:', e);
      res.status(500).json({ 
        error: 'Error al procesar los resultados de validación',
        rawOutput: result
      });
    }
  });
});

module.exports = router;
