import {Sequelize} from "sequelize"
export const sequelize = new Sequelize("cruds","root","",{
    host:"localhost",
    dialect:"mysql"
})
export const connectDB = async()=>{
    return await sequelize.sync({alter:true}).then((result)=>{
        console.log(`connectDB............`);
    }).catch((err)=>{
        console.log(`Fail to connectDB...........${err}`);
    })
}