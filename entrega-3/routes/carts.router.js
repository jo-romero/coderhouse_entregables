const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const manager = new CartManager();
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  const cart = await manager.createCart();
  res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
  const cart = await manager.getCartById(req.params.cid);
  cart ? res.json(cart.products) : res.status(404).send('Carrito no encontrado');
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

    // Validación de ObjectId
  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ error: 'ID de carrito inválido' });
  }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: 'ID de producto inválido' });
  }

  const updatedCart = await manager.addProductToCart(cid, pid);

  updatedCart ? res.json(updatedCart) : res.status(404).send('Carrito o producto no encontrado');
});

//elimino un producto (pid) de un carrito (cid)
router.delete('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const result = await manager.removeProductFromCart(cid, pid);
    if (!result) {
      return res.status(404).send('Carrito o producto no encontrado');
    }
    res.json({ status: 'success', message: `Producto ${pid} eliminado del carrito ${cid}` });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


//elimino todos los productos de un carrito (cid)
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const result = await manager.emptyCart(cid);

    if (!result) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.json({ status: 'success', message: `Carrito ${cid} vaciado` });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.put('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  // Validación básica
  if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: 'ID de carrito o producto inválido' });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'Cantidad inválida. Debe ser un entero mayor o igual a 1.' });
  }

  try {
    const updatedCart = await manager.updateProductQuantity(cid, pid, quantity);
    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }

    res.json({ status: 'success', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//actualizo todos los productos del carrito
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const products = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Se espera un array de productos' });
  }

  try {
    const updatedCart = await manager.updateCartProducts(cid, products);
    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});





module.exports = router;