// server/validate.js
const { exec } = require('child_process');

module.exports = (req, res) => {
    const componentes = req.body.componentes;
    if (!Array.isArray(componentes) || componentes.length === 0) {
        return res.status(400).json({ error: 'Componentes no válidos' });
    }

    const componentesArg = componentes.join('|').replace(/"/g, '');
    const cmd = `python neo4j_validation.py "${componentesArg}"`;

    console.log("Ejecutando validación con componentes:", componentes);

    exec(cmd, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error al ejecutar script:`, error);
            return res.status(500).json({ error: stderr || 'Error ejecutando script' });
        }

        console.log("✅ Validación completada:", stdout);
        res.json({ result: stdout });
    });
};