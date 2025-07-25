const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/products');


class CartManager {
  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart;
  }

  async getCartById(id) {
    try {
      return await Cart.findById(id).populate('products.product');
    } catch (error) {
      return null;
    }
  }

  async addProductToCart(cid, pid) {
    try {

      // Valido ambos IDs
      if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return null; // Alguno de los IDs es inválido
      }

    // Busco carrito y producto
    const cart = await Cart.findById(cid);
    const product = await Product.findById(pid);

    if (!cart || !product) return null; // Si no existe alguno, se cancela

      // Buscar si el producto ya está en el carrito
      const prodIndex = cart.products.findIndex(p => p.product.toString() === pid);

      if (prodIndex !== -1) {
        cart.products[prodIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error('Error en addProductToCart:', error);
      return null;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {

      if (
        !mongoose.Types.ObjectId.isValid(cartId) ||
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        throw new Error('ID de carrito o producto inválido');
      }

      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = cart.products.filter(p => p.product.toString() !== productId);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
    }
  }

  async emptyCart(cartId) {
    try {

      if (
        !mongoose.Types.ObjectId.isValid(cartId)
      ) {
        throw new Error('ID de carrito inválido');
      }

      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  }  

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
      if (productIndex === -1) return null;

      cart.products[productIndex].quantity = quantity;

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar cantidad: ${error.message}`);
    }
  }

  async updateCartProducts(cartId, newProducts) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;

      cart.products = newProducts.map(p => ({
        product: p.product, // dejar como string válido (Mongo lo convierte)
        quantity: p.quantity
      }));

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar productos del carrito: ${error.message}`);
    }
}

}

module.exports = CartManager;