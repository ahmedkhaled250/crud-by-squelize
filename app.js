import express from "express"
import * as indexRouter from "./modules/index.router.js"
import { connectDB } from "./DB/connection.js"
import { userModel } from "./DB/models/user.model.js"
import { productModel } from "./DB/models/product.model.js"
const port = 5000
const baseUrl = '/api/v1'
const app = express()
app.use(express.json())
connectDB()
userModel.hasMany(productModel,{
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
})
productModel.belongsTo(userModel)
app.use(`${baseUrl}/auth`,indexRouter.authRouter)
app.use(`${baseUrl}/user`,indexRouter.userRouter)
app.use(`${baseUrl}/product`,indexRouter.productRouter)
app.use('*',(req,res)=>{
    return res.status(404).json({message:"404",details:"Not found page"})
})
app.listen(port,()=>console.log(`running.................${port}`))