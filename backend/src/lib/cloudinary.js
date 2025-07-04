import { v2 as cloudinary } from "cloudinary"
import { config } from "dotenv"

config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Use HTTPS URLs
});

// Test the connection
const testCloudinaryConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log('Cloudinary connection successful:', result);
    } catch (error) {
        console.error('Cloudinary connection failed:', error.message);
    }
};

// Call the test function when the module is loaded
testCloudinaryConnection();

export default cloudinary;