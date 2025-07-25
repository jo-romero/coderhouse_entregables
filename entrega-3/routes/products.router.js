const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

/*
router.get('/', async (req, res) => {
  res.json(await manager.getProducts());
});

router.get('/:pid', async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).send('Producto no encontrado');
});
*/

// GET con filtros: /api/products?limit=5&page=2&sort=asc&query=ropa
router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const product = await productManager.addProduct(req.body);
  res.status(201).json(product);
});

router.put('/:pid', async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).send('Producto no encontrado');
});

router.delete('/:pid', async (req, res) => {
  const success = await productManager.deleteProduct(req.params.pid);
  success ? res.sendStatus(204) : res.status(404).send('Producto no encontrado');
//  success ? res.sendStatus(204).send(`Producto con ID ${req.params.pid} eliminado`) : res.status(404).send('Producto no encontrado');
// no me funciona 
});

module.exports = router;