import { Router } from "express";
import Product from "../dao/productManager.js";
import ProductManager from "../dao/productManager.js";

const manager = new ProductManager("./src/data/products.json");

const router = Router();

// Get Products
router.get("/", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    return res.json(await manager.getProducts());
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: `Internal Server Error` });
  }
});

// Get Product by ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    res.setHeader("Content-Type", "application/json");
    res.json(await manager.getProductById(pid));
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: `Internal Server Error` });
  }
});

// Add Product
router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category ||
    !thumbnails
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const newProduct = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
  try {
    res.setHeader("Content-Type", "application/json");
    return res.json(await manager.addProduct(newProduct));
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: `Internal Server Error` });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const product = manager.getProductById(Number(id));

  if (!product) {
    return res.status(404).json({
      error: "No se encontro el producto",
    });
  }
  manager.deleteProduct(Number(id));

  res.json(product);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status,
  } = req.body;

  const product = await manager.getProductById(id);

  if (!product) {
    return res.status(404).json({
      error: "No se encontro el producto",
    });
  }

  manager.updateProduct(product.id, {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
  });

  const newProduct = manager.getProductById(Number(id));

  res.json(newProduct);

  return res.status(400).json({
    error: `No se pudo actualizar el producto: ${error.message}`,
  });
});

export default router;
