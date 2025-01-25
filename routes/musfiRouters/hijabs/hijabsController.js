const hijabs = require("../../../Database/mufiModels/hijabs");
const { AppError } = require("../../../utils/AppError");
const catchAsyncError = require("../../../utils/catchAsyncError");
const firebase = require("../../../utils/firebase");
const { responseFetchProduct } = require("../../../utils/responseModel");


const addHijab = catchAsyncError(async (req, res, next) => {
    try {

        let imageUrls = [];
        for (let file of req.files) {
            const imageName = file.filename;
            const imagePath = file.path
            let imageUrl = '';
            await firebase.uploadFile(imagePath, "hijabs/" + imageName);
            await firebase.generateSignedUrl("hijabs/" + imageName)
                .then(url => {
                    imageUrl = url;
                })
                .catch(e => {
                    console.log(e);
                });

            imageUrls.push(imageUrl);  // Collect the signed URLs of the images
        }

        const addProduct = new hijabs({
            ...req.body,  // Get non-file data from req.body
            images: imageUrls,  // Save the image URLs
        });
        await addProduct.save();

        res.status(201).json({ message: "success", addProduct });
    } catch (e) {
        res.status(500).json({ message: e.message });

    }
});

const updateHijab = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;  // Get the hijab ID from the route params

        // Find the hijab by ID in the database
        const hijab = await hijabs.findById(id);
        if (!hijab) {
            return res.status(404).json({ message: "Hijab not found." });
        }

        // Process file uploads (if any)
        let imageUrls = hijab.image; // Keep old images if no new ones are uploaded
        if (req.files && req.files.length) {
            imageUrls = [];  // Clear existing images if new ones are uploaded
            for (let file of req.files) {
                let imageUrl = '';
                await firebase.uploadFile(file.path, "hijabs/" + file.filename);
                await firebase.generateSignedUrl("hijabs/" + file.filename)
                    .then(url => {
                        imageUrl = url;
                    })
                    .catch(e => {
                        console.log(e);
                    });
                imageUrls.push(imageUrl);  // Save new image URLs
            }
        }

        // Update the hijab product with the new data
        hijab.name = req.body.name || hijab.name;  // Keep old name if no new name
        hijab.percentage = req.body.percentage || hijab.percentage;  // Keep old percentage if no new percentage
        hijab.images = imageUrls;  // Update images

        // Save the updated product
        await hijab.save();

        res.status(200).json({ message: "Hijab updated successfully", hijab });
    } catch (e) {
        res.status(500).json({ message: "Failed", error: e.message });
    }
});

const getHijabs = catchAsyncError(async (req, res, next) => {
    hijabs.find()
        .exec()
        .then(result => {
            res.status(200).send(responseFetchProduct(true, result));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(responseFetchProduct(false, err));
        });
});

const deleteHijabs = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    hijabs.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted!',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = { addHijab, updateHijab, getHijabs, deleteHijabs };