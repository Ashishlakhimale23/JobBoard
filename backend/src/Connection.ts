import mongoose from "mongoose";

export async function Connection(url:string){
    try{
        await mongoose.connect(url).then(()=>{
            console.log("DB connected")
        })
    }catch(error){
        console.log(error)
        console.log("DB not connected")
    }
}