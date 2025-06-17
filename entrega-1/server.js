//import express from "express"
const express = require('express')

const app = express()
const PORT = 8080

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

// Middleware para poder trabajar con datos JSON
app.use(express.json())

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);



app.listen(PORT, () => 
{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})