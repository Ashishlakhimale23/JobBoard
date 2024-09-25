import cloudinary from "cloudinary"
import {Readable} from "stream"

export  function CloudinaryUpload(file:Express.Multer.File){
 return new Promise<string>((resolve,reject)=>{
        let uploadStream = cloudinary.v2.uploader.upload_stream({
            upload_preset:process.env.UPLOAD_PRESET
        },(err,res)=>{
            if(err){
                return reject(err)
            } 
            resolve(res?.secure_url!)
        })
        Readable.from(file?.buffer!).pipe(uploadStream)
})
}