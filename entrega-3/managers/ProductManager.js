const Product = require('../models/products');

class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    try {
      const filter = query ? { category: query } : {};
      const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortOption,
        select: '-__v', // Ocultar __v
        lean: true //para que devuelva objetos planos sin metadatos de Mongoose
      };

      const result = await Product.paginate(filter, options);

       // Armado de links
      const baseUrl = `?limit=${limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`;
      const prevLink = result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}` : null;
      const nextLink = result.hasNextPage ? `${baseUrl}&page=${result.nextPage}` : null;

      return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        page: result.page,
        prevLink,
        nextLink
      };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener el producto por ID: ${error.message}`);
    }
  }

  async addProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      return await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

module.exports = ProductManager;