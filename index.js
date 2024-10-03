const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

//console.log(process.env)

// Crear el servidor de express
const app = express(); // Inicializar express

// Conexión a la base de datos	
dbConnection();

// CORS
//app.use((req, res, next) => {
//    res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//    next();
//});

// Directorio publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json())

//// Rutas
//app.get('/', (req, res) => {
//    res.json({
//        ok: true,
//        msg: 'Hello World'
//    })
//})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

app.listen(process.env.PORT, () => console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`));
