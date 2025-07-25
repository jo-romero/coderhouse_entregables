const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const manager = new ProductManager();

router.get('/', async (req, res) => {
  res.json(await manager.getProducts());
});

router.get('/:pid', async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).send('Producto no encontrado');
});

router.post('/', async (req, res) => {
  const product = await manager.addProduct(req.body);
  res.status(201).json(product);
});

router.put('/:pid', async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).send('Producto no encontrado');
});

router.delete('/:pid', async (req, res) => {
  const success = await manager.deleteProduct(req.params.pid);
  success ? res.sendStatus(204) : res.status(404).send('Producto no encontrado');
//  success ? res.sendStatus(204).send(`Producto con ID ${req.params.pid} eliminado`) : res.status(404).send('Producto no encontrado');
// no me funciona 
});

module.exports = router;