import multer from "multer";
import fs from "fs";

// Ensure folder exists
const tempFolder = "./public/temp";
if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempFolder); // Now guaranteed to exist
    },
    filename: function (req, file, cb) {
        // Prepend timestamp to avoid collisions
        cb(null, Date.now() + "-" + file.originalname);
    }
});

export const upload = multer({
    storage,
});
