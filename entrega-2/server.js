//import express from "express"
const express = require('express')
const path = require('path'); //
const { Server } = require('socket.io'); //
const exphbs = require('express-handlebars'); //

const app = express()
const PORT = 8080

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router'); //

// Middleware para poder trabajar con datos JSON
app.use(express.json())

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);//

//desde acá
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
//hasta aca

// app.listen(PORT, () => 
// {
//     console.log(`Servidor corriendo en puerto ${PORT}`)
// })

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const io = new Server(httpServer);
const ProductManager = require('./managers/ProductManager');
const manager = new ProductManager();

io.on('connection', async socket => {
  console.log('Cliente conectado');

  socket.emit('updateProducts', await manager.getProducts());

  socket.on('newProduct', async data => {
    await manager.addProduct(data);
    io.emit('updateProducts', await manager.getProducts());
  });
});