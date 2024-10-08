import { NextFunction,Request,Response } from "express"
import admin from "../Utils/firebaseadmin"
declare global {
    namespace Express{
        interface Request{
            uid?:string;
        }
    }
}
export const AuthMidddleware=async(req:Request,res:Response,next:NextFunction)=>{
    let token = req.headers.Authorization || req.headers.authorization
    if(typeof token !== "string" || !token?.startsWith("Bearer ")){
        return res.status(401).json({message:"unauthorized"})
    }else{
        try{
            const authtoken = token.split(" ")[1]
            console.log(authtoken)
            let checkrevoked = true 
            await admin.auth().verifyIdToken(authtoken,checkrevoked).then((payload)=>{

                req.uid = payload.uid 
                console.log("next")
                next()
            }).catch((error)=>{
                let errormessage = error.code
                console.log(errormessage)
                if(errormessage == 'auth/id-token-revoked' || errormessage== 'auth/id-token-expired' ){
                    return res.status(401).json({message:"token expired"}).end()
                }else{
                    return res.status(401).json({message:"unauthorized"}).end()
                }
            })
        }catch(error){
            return res.json({message:"unauthorized"})
        }
    } 
 

} 