import { Request,Response } from "express"
import { User } from "../Models/user"
import {config} from "dotenv"
import admin from "../Utils/firebaseadmin" 
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

export const handlelogin = async (req: Request<{},{},{idtoken: string}>, res: Response) => {
    try {
        console.log("Starting login process");

        // Verify the Firebase ID token
        console.time("verifyIdToken");
        const idtoken = await admin.auth().verifyIdToken(req.body.idtoken);
        console.timeEnd("verifyIdToken");
        console.log("Token verified:", idtoken);

        // Check if the user exists in your database
        console.time("User.findOne");
        const userExist = await User.findOne({ firebaseUid: idtoken.uid, email: idtoken.email });
        console.timeEnd("User.findOne");

        if (!userExist) {
            console.log("User doesn't exist");
            return res.status(404).json({ message: "User doesn't exist" });
        } else {
            console.log("User logged in successfully");
            return res.status(200).json({ message: "Logged in" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal Server Error", error: "error"});
    }
};



export const handlecornjob = async(req:Request,res:Response)=>{
   return res.status(200).send("fine")
}