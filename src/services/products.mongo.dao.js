import productsModel from "../models/products.model.js";
import MongoseSingleton from "./mongo.singleton.js";

MongoseSingleton.getInstance();

class ProductService {
    constructor() {
    }

    async addProduct(product){
        const process = await productsModel.create(product);
        return process === null ? 'No se pudo crear el producto' : 'Producto creado';
    }

    async getProducts(page = 1, limit = 10) {
        const options = {
            page,
            limit,
            lean: true,
            leanWithId: false,
        };
    
        const products = await productsModel.paginate({}, options);
    
        return {
            pagination: {
                total: products.totalDocs,
                pages: products.totalPages,
                currentPage: products.page,
                hasNextPage: products.hasNextPage,
                hasPrevPage: products.hasPrevPage,
                nextPage: products.nextPage,
                prevPage: products.prevPage,
            },
            products: products.docs,
        };
    }
    async getProduct(id) {
        const product = await productsModel.findById(id);
        return product === null ? 'No se encuentra el producto' : product;
    }

    async updateProduct(id, newContent) {
        return await productsModel.findByIdAndUpdate(id, newContent, { new: true });
    }

    async deleteProduct(id) {
        return await productsModel.findByIdAndDelete(id);
    }
    // async getProduct(id) {
    //     const product = await productModel.findById(id);
    //     return product === null ? 'No se encuentra el producto' : product;
    // }

    // async updateProduct(id, newContent) {
    //     return await productModel.findByIdAndUpdate(id, newContent);
    // }

    // async deleteProduct(id) {
    //     return await productModel.findByIdAndDelete(id);
    // }
}



export default ProductService;