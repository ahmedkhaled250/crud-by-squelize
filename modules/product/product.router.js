import {Router} from 'express'
import * as productController from "./controller/product.js"
const router = Router()
router.post('/',productController.addProduct)
router.put('/:id',productController.updateProduct)
router.delete('/:id',productController.deleteProduct)
router.get('/',productController.products)
router.get('/getProductbByPrice/:price',productController.getProductbByPrice)  
router.get('/getProductbByTitle/:title',productController.getProductbByTitle)  
router.get('/:id',productController.getProductById)  
export default router