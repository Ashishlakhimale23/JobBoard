import { Request,Response } from "express"
import { User } from "../Models/user"
import {config} from "dotenv"
import admin from "../Utils/firebaseadmin" 
import { RemoveAnySpaces } from "../Utils/RemoveSpaces"
config()

export const handlesignin = async(req:Request<{},{},{idtoken:string}>,res:Response)=>{
    let username:string; 
    const idtoken = await admin.auth().verifyIdToken(req.body.idtoken) 
       let index =  idtoken.email!.indexOf("@")
       username= idtoken.email!.substring(0,index)
       const userexist =await User.findOne({firebaseUid:idtoken.uid,email:idtoken.email})  
       if(userexist){
          return res.json({message:"user already exists"}).status(409)
       }
       else{
       try{
        const Newuser = new User({
            email:idtoken.email,
            firebaseUid:idtoken.uid,
            Name:username
        })
         await Newuser.save().then(()=>{
            return res.status(200).json({message:"created account"})
         }).catch((err)=>{
            console.log(err)
            return res.status(500).json({message:"failed to create account"})
         })
       }
       catch(err){
         console.log(err)
        return res.status(500).json({message:"internal server error"})
       }
}
}

export const handlelogin=async(req:Request<{},{},{idtoken:string}>,res:Response)=>{
    const idtoken = await admin.auth().verifyIdToken(req.body.idtoken)
    const userexist= await User.findOne({firebaseUid:idtoken.uid,email:idtoken.email}) 
    if(!userexist){
        return res.json({message:"user doesnt exist"}).status(404)
    }
    else{
            
    return res.status(200).json({message:"Logged in"})
}
}

export const handlecornjob = async(req:Request,res:Response)=>{
   return res.status(200).send("fine")
}