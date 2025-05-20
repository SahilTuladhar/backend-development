import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log('File has been successfully uploaded and its url is:' , response.url);
    

    fs.unlinkSync(localFilePath); // unlinking after successful uoload to the cloud
    return response;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(localFilePath); //unlink the file if it leads to error
    return null;
  }
};

export default uploadOnCloudinary;
