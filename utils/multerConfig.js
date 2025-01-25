const multer = require('multer');

// Disk storage configuration where images will be stored
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');  // Specify the folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

// File filter to accept only specific image types
const fileFilter = (req, file, cb) => {
    // Allow only jpeg, png, and jpg formats
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);  // Accept the file
    } else {
        cb(null, false);  // Reject the file
    }
};

// Multer configuration to handle file uploads
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5  // Limit the file size to 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
