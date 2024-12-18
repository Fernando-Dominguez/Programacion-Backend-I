import fs from "fs";

// Class Product
class Product {
  constructor(
    title,
    description,
    price,
    thumbnails,
    category,
    status = true,
    code,
    stock
  ) {
    (this.title = title),
      (this.description = description),
      (this.code = code),
      (this.price = price),
      (this.status = status),
      (this.stock = stock),
      (this.category = category),
      (this.thumbnails = thumbnails);
  }
}
// Class ProductManager
class ProductManager {
  constructor(path) {
    this.path = path;
    // Validamos si existe el archivo
    if (fs.existsSync(this.path)) {
      try {
        this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      } catch (error) {
        this.products = [];
      }
    } else {
      this.products = [];
    }
  }

  // Add Product
  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category ||
      !product.thumbnails
    ) {
      console.log("Son obligatorios aaaa todos los campos");
      return;
    }

    // Valida que el código no exista en el array
    if (this.products.some((p) => p.code === product.code)) {
      console.log("El código ya existe");
      return;
    }

    if (this.products.length > 0) {
      // Si no esta vacio, se suma 1 para el nuevo id
      const newId = this.products[this.products.length - 1].id + 1;
      product = { id: newId, ...product };
    } else {
      // Si esta vacio empiezo con el id 1
      product.id = 1;
    }

    this.products.push(product);

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );

      console.log("El producto fue creado correctamente");
    } catch (error) {
      console.log(error);
    }
    console.log(product);
    return product;
  }

  getProducts() {
    // Devolvemos el array de productos
    return this.products;
  }

  getProductById(idProduct) {
    if (isNaN(Number(idProduct))) {
      console.log("El id debe ser un número");
      return;
    }

    // Buscamos el producto por su id
    const product = this.products.find(
      (product) => product.id === Number(idProduct)
    );

    if (!product) {
      return "No se encontro el producto";
    }

    return product;
  }

  deleteProduct(idProduct) {
    // Obtenemos el indice del producto
    const productIndex = this.products.findIndex(
      (product) => product.id === idProduct
    );

    if (productIndex === -1) {
      console.log("No se encontro el producto");
      return;
    }

    // Eliminamos el producto
    this.products.splice(productIndex, 1);

    try {
      fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );

      console.log("Se elimino el producto correctamente");
    } catch (error) {
      console.log(error);
    }
  }

  updateProduct(idProduct, product) {
    // Obtenemos el indice del producto
    const productIndex = this.products.findIndex(
      (product) => product.id === idProduct
    );

    if (productIndex === -1) {
      console.log("No se encontro el producto");
      return;
    }
    const productOld = this.products[productIndex];

    // Actualizamos el producto

    const productUpgraded = {
      id: productOld.id,
      title: product.title ? product.title : productOld.title,
      description: product.description
        ? product.description
        : productOld.description,
      price: product.price ? product.price : productOld.price,
      thumbnails: product.thumbnails
        ? product.thumbnails
        : productOld.thumbnails,
      code: productOld.code,
      stock: product.stock ? product.stock : productOld.stock,
      category: product.category ? product.category : productOld.category,
      status: product.status ?? productOld.status,
    };

    this.products[productIndex] = productUpgraded;

    try {
      fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );

      console.log("Se actualizo el producto correctamente");
    } catch (error) {
      console.log(error);
    }
  }
}

export default ProductManager;
