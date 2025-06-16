import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if(fs.existsSync(localFilePath)){
      fs.unlinkSync(localFilePath)
      console.log(`File has been deleted: ${localFilePath}`);
      
    }
    
    return response;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(localFilePath); //unlink the file if it leads to error
    return null;
  }
};

 export const deleteFromCloudinary = async(oldURL) => {

try {
    if(!oldURL){
      return 
    }
  
    const result = await cloudinary.uploader.destroy(oldURL)
  
   return result
} catch (error) {
  return error  
}
  
}

