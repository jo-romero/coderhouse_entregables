const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const CartManager = require('../managers/CartManager');

const manager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
  const productsData = await manager.getProducts(req.query);

  //console.log(productsData);

  res.render('home', {
      products: productsData.payload,
      hasPrevPage: productsData.hasPrevPage,
      hasNextPage: productsData.hasNextPage,
      prevLink: productsData.prevLink,
      nextLink: productsData.nextLink,
      page: productsData.page
    });
});


router.get('/cart/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    //console.log('Buscando carrito con ID:', cid);
    const cart = await cartManager.getCartById(cid);
    //console.log('Carrito encontrado:', cart);

    if (!cart) {
      return res.status(404).render('error', { message: 'Carrito no encontrado' });
    }

    //await cart.populate('products.product');



    res.render('cart', { 
      cartId: cid,
      products: cart.products.map(p => ({
        title: p.product.title,
        price: p.product.price,
        quantity: p.quantity,
        productId: p.product._id
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al obtener el carrito' });
  }
});


router.get('/realtimeproducts', async (req, res) => {
  const productsData = await manager.getProducts();
  res.render('realTimeProducts', { productsData });
});

module.exports = router;