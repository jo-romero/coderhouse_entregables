const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    }
  ]
}, { versionKey: false });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;