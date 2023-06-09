const mongoose=require("mongoose")
mongoose.connect("mongodb://0.0.0.0:27017/no")
.then(()=>{
    console.log("Base de Datos conectada(usuarios)");
})
.catch(()=>{
    console.log('La conexion a fallado');
})


const newSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection = mongoose.model("usuarios",newSchema)

module.exports=collection //para poder conseguir la collectione en cualquier archivo