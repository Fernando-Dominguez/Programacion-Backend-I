import { Router } from "express";
import CartManager from "../dao/cartsManager.js";

const cartManager = new CartManager("./src/data/carts.json");

const router = Router();

router.post("/", async (req, res) => {
    try {
        await cartManager.createrCart();
        res.status(201).json({ message: "El carrito se creó correctamente" });
    } catch (error) {
        res.status(400).json({ error: "No se creó el carrito" });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCart(Number(cid));

        if (!cart) {
            return res.status(404).json({ error: "No existe el carrito" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: "No se pudo cargar el carrito" });
    }
});


router.post("/:id/product/:idProduct", async (req, res) => {
    const { id, idProduct } = req.params;
    try {
        await cartManager.addProdToCart(+id, +idProduct);
        res.status(201).json({ message: "El producto se agregó al carrito" });
    } catch (error) {
        res.status(400).json({ error: "El producto no se pudo agregar al carrito" });
    }
});
export default router;