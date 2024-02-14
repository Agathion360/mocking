import { Router } from "express";
import { ProductController } from '../controllers/product.controller.js'
import { catcher } from '../utils.js';




const router = Router();
const productController = new ProductController();


router.get("/", catcher(async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const productsData = await productController.getProducts(page, limit);
    res.status(200).send({ status: "OK", data: productsData });
}));


router.get('/:pid', catcher(async(req, res) => {
    const {pid} = req.params;
    const product = await productController.getProduct(pid);
    res.status(200).send({status:'ok', data: product});
}));

router.post('/', catcher(async(req, res) => {
    const product = req.body;
    const newProduct = await productController.addProduct(product);
    res.status(201).send({status:'ok', data: newProduct});
}));

router.put('/:pid', catcher(async(req, res) => {
    const {pid} = req.params;
    const product = req.body;
    const updatedProduct = await productController.updateProduct(pid, product);
    res.status(200).send({status:'ok', data: updatedProduct});
}));

router.delete('/:pid', catcher(async(req, res) => {
    const {pid} = req.params;
    await productController.deleteProduct(pid);
    res.status(200).send({status:'ok', data: `Product ${pid} deleted`});
}));




// router.get('/:pid', async(req, res) => {
//     const {pid} = req.params;
//     const product = await productController.getProductsById(pid);
//     res.status(200).send({status:'ok', data: product});
// });

// router.post('/', async(req, res) => {
//     const product = req.body;
//     const newProduct = await productController.addProduct(product);
//     res.status(201).send({status:'ok', data: newProduct});
// });

// router.put('/:pid', async(req, res) => {
//     const {pid} = req.params;
//     const product = req.body;
//     const updatedProduct = await productController.updateProduct(pid, product);
//     res.status(200).send({status:'ok', data: updatedProduct});
// });

// router.delete('/:pid', async(req, res) => {
//     const {pid} = req.params;
//     await productController.deleteProduct(pid);
//     res.status(200).send({status:'ok', data: `Product ${pid} deleted`});
// });

export default router;

