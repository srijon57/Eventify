import multer from "multer";
import fs from "fs";
import path from "path";

// Use Vercel's /tmp directory for temporary files
const tempFolder = path.join("/tmp", "uploads");

// Ensure the folder exists
if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempFolder); // Use the /tmp directory
    },
    filename: function (req, file, cb) {
        // Prepend timestamp to avoid collisions
        cb(null, Date.now() + "-" + file.originalname);
    }
});

export const upload = multer({ storage });
