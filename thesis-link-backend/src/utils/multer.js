const multer = require("multer");

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the destination folder where uploaded files will be stored
        cb(
            null,
            file.mimetype.startsWith("image")
                ? "public/images/"
                : "public/uploads/"
        );
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniquePrefix + "-" + file.originalname);
    },
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
