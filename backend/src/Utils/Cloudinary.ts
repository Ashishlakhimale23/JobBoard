import cloudinary from "cloudinary";
import {config} from "dotenv"
import multer from "multer"
config()
cloudinary.v2.config({
    cloud_name :process.env.CLOUDINARY_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})
export const upload = multer() 
export default cloudinary