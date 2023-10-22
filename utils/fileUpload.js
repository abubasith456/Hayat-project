const cloudinary = require('cloudinary').v2;
const fileUpload = async (file) => {
    console.log(file);
    if (file.mimetype.slice(0, 5) === 'image') {
        return await cloudinary.uploader.upload(file.path, {
            resource_type: 'image',
            end_offset: '30',
            video_codec: 'auto',
        });
    }
    return await cloudinary.uploader.upload(file.path);
};

module.exports = fileUpload;