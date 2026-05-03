import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const placeholderValues = ["your_cloud_name", "your_api_key", "your_api_secret"];
const invalidValue = [cloudName, apiKey, apiSecret].some(
  (value) => !value || placeholderValues.includes(value.trim())
);

if (invalidValue) {
  console.warn(
    "Cloudinary environment is not fully configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to valid values."
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
