const { promises: fs } = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  //FUNCION OBTENER TODOS LOS PRODUCTOS
  async getProducts() {
    return await getJSONFromFile(this.path);
  }

  //FUNCION GET ELEMENT BY ID
  async getProductsById(productId) {
    const products = await getJSONFromFile(this.path);
    const product = products.find(obj => obj.id === productId);
    return product;
  }


  //FUNCION UPDATE 
  async updateProduct(productId, fieldName, fieldValue) {
    const products = await getJSONFromFile(this.path);

    let fieldFound = false;
    const updatedProducts = products.map(product => {
      if (product.id === productId && product.hasOwnProperty(fieldName)) {
        if (fieldName === 'code') {
          const isCodeUnique = !products.some(p => p.code === fieldValue);
          if (!isCodeUnique) {
            throw new Error(`El código '${fieldValue}' ya está en uso.`);
          }
        }

        fieldFound = true;
        return { ...product, [fieldName]: fieldValue };
      }
      return product;
    });

    if (!fieldFound) {
      throw new Error(`El campo '${fieldName}' no se encuentra en ninguno de los productos.`);
    }

    await saveJSONToFile(this.path, updatedProducts);
    const updatedProductResult = updatedProducts.find(product => product.id === productId);

    if (!updatedProductResult) {
      return "Producto no encontrado";
    }

    return updatedProductResult;
  }


  //FUNCION AGREGAR PRODUCTO
  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son obligatorios.');
    }
    const products = await getJSONFromFile(this.path);

    const existingProduct = products.find(p => p.code === code);
    if (typeof existingProduct !== 'undefined' && existingProduct !== null) {
      throw new Error('El código del producto ya está en uso.');
    }

    const id = Math.floor(Math.random() * 1000000);
    const newProduct = { id, title, description, price, thumbnail, code, stock };
    products.push(newProduct);
    await saveJSONToFile(this.path, products);
  }

  //FUNCION BORRAR PRODUCTO
  async deleteProduct(productId) {
    const products = await getJSONFromFile(this.path);
    const updatedProducts = products.filter(product => product.id !== productId);
    await saveJSONToFile(this.path, updatedProducts);
    if (products.length === updatedProducts.length) {
      return "Producto no encontrado";
    }
    return "Producto eliminado exitosamente";
  }



}

const getJSONFromFile = async (path) => {
  try {
    await fs.access(path);
  } catch (error) {
    return [];
  }
  const content = await fs.readFile(path, 'utf-8');
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
  }
}

const saveJSONToFile = async (path, data) => {
  const content = JSON.stringify(data, null, '\t');
  try {
    await fs.writeFile(path, content, 'utf-8');
  } catch (error) {
    throw new Error(`El archivo ${path} no pudo ser escrito.`);
  }
}

// const desafio2 = async () => {
//   try {
//     const productManager = new ProductManager('./products.json');

//     //CARGAR NUEVO PRODUCTO
//     await productManager.addProduct({
//       title: 'morrones',
//       description: 'tomate del mejor',
//       price: 25,
//       thumbnail: 'https://www.google.com',
//       code: 1233212,
//       stock: 44,
//     });


//     //OBTENER PRODUCTOS
//     const products = await productManager.getProducts();
//     console.log('😎 Acá los productos:', products);


//     //OBTENER PRODUCTOS POR ID
//     const idProduct = 1;
//     const productsById = await productManager.getProductsById(idProduct);
//     console.log(`😎 Acá el producto id ${idProduct}:`, productsById);


//     //ACTUALIZAR CAMPO EN PRODUCTO
//     const productUpdate = await productManager.updateProduct(97667, 'code', 12312);
//     console.log("El producto actualizado es: ", productUpdate);


//     //BORRAR PRODUCTO
//     const deletedProduct = await productManager.deleteProduct(97667);
//     console.log("El resultado de la eliminación es:", deletedProduct);



//   } catch (error) {
//     console.error('😱 Ha ocurrido un error: ', error.message);
//   }
// };

// desafio2()

module.exports = {
  getJSONFromFile,
  saveJSONToFile,
  ProductManager
};
