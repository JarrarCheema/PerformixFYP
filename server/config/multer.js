import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

// Simulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the upload path
const uploadPath = path.join(__dirname, '../uploads/profilePicture');

// Ensure the directory exists or create it
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // `recursive: true` ensures nested directories are created
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath); // Use the pre-checked directory
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const originalName = path.parse(file.originalname).name; // Extract the original filename without extension
        const extension = path.extname(file.originalname); // Extract the file extension
        const unique = "Q-D-H-T-E";
        const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
        const newFilename = `${originalName}-${unique}-${timestamp}-${randomNumber}${extension}`; // Concatenate original name, unique string, timestamp, random number, and extension
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });

export default upload;
