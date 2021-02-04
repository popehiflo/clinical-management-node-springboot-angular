const express = require('express');

// Crear el servidor de express
const app = express();

// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola Mundo!'
    })
});

app.listen(3000, () => {
    console.log('Serve node iniciado en puerto ' + 3000);
})