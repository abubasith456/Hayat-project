// const multer = require('multer');

// //Disk storage where image store
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/fruits');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

// function storage(path) {
//     return diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, path);
//         },
//         filename: function (req, file, cb) {
//             cb(null, file.originalname);
//         }
//     });
// }

// //Check the image formate
// const fileFilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

// function filePath(path) {
//     return multer({
//         storage: storage(path),
//         limits: {
//             fileSize: 1024 * 1024 * 5
//         },
//         fileFilter: fileFilter
//     });

// }

// module.exports = { filePath }
