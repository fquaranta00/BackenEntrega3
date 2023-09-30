const express = require('express');
const { getJSONFromFile, saveJSONToFile, ProductManager }  = require('./ProductManager'); 
const productManager = new ProductManager('./products.json'); 

const app = express();
const port = 8080; 


// Endpoint para obtener productos
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    const products = await productManager.getProducts();

    if (limit !== null) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Endpoint para obtener productos especificos

app.get('/products/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      console.log('productid: ',productId);
      const product = await getProductById(productId);
      console.log(product);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  async function getProductById(productId) {
    const products = await getJSONFromFile('./products.json'); 
    const product = products.find((product) => product.id === parseInt(productId, 10));
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }
  

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
