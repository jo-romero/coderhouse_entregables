const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/products.json');
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id == id);
  }

  async addProduct(product) {
    const products = await this._readFile();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { id: newId, status: true, ...product };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updatedFields, id: products[index].id };
    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const newProducts = products.filter(p => p.id != id);
    await this._writeFile(newProducts);
    return newProducts.length < products.length;
  }
}

module.exports = ProductManager;