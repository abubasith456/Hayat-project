const featureProducts = require("../../../Database/mufiModels/featureProduct");
const { AppError } = require("../../../utils/AppError");
const catchAsyncError = require("../../../utils/catchAsyncError");
const firebase = require("../../../utils/firebase");
const { responseFetchProduct } = require("../../../utils/responseModel");


const addFeatureProducts = catchAsyncError(async (req, res, next) => {
    try {

        let imageUrls = [];
        for (let file of req.files) {
            const imageName = file.filename;
            const imagePath = file.path
            let imageUrl = '';
            await firebase.uploadFile(imagePath, "featureProducts/" + imageName);
            await firebase.generateSignedUrl("featureProducts/" + imageName)
                .then(url => {
                    imageUrl = url;
                })
                .catch(e => {
                    console.log(e);
                });

            imageUrls.push(imageUrl);  // Collect the signed URLs of the images
        }

        const addProduct = new featureProducts({
            ...req.body,  // Get non-file data from req.body
            images: imageUrls,  // Save the image URLs
        });
        await addProduct.save();

        res.status(201).json({ message: "success", addProduct });
    } catch (e) {
        res.status(500).json({ message: e });

    }
});

const updateFeatureProducts = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;  // Get the hijab ID from the route params

        // Find the hijab by ID in the database
        const featureProducts = await featureProducts.findById(id);
        if (!featureProducts) {
            return res.status(404).json({ message: "Hijab not found." });
        }

        // Process file uploads (if any)
        let imageUrls = featureProducts.image; // Keep old images if no new ones are uploaded
        if (req.files && req.files.length) {
            imageUrls = [];  // Clear existing images if new ones are uploaded
            for (let file of req.files) {
                let imageUrl = '';
                await firebase.uploadFile(file.path, "featureProducts/" + file.filename);
                await firebase.generateSignedUrl("featureProducts/" + file.filename)
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
        featureProducts.name = req.body.name || featureProducts.name;  // Keep old name if no new name
        featureProducts.percentage = req.body.percentage || featureProducts.percentage;  // Keep old percentage if no new percentage
        featureProducts.images = imageUrls;  // Update images

        // Save the updated product
        await featureProducts.save();

        res.status(200).json({ message: "Hijab updated successfully", featureProducts: featureProducts });
    } catch (e) {
        res.status(500).json({ message: "Failed", error: e.message });
    }
});

const getFeatureProducts = catchAsyncError(async (req, res, next) => {
    featureProducts.find()
        .exec()
        .then(result => {
            res.status(200).send(responseFetchProduct(true, result));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(responseFetchProduct(false, err));
        });
});

const deleteFeatureProducts = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    featureProducts.deleteOne({ _id: id })
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

module.exports = { addFeatureProducts, updateFeatureProducts, getFeatureProducts, deleteFeatureProducts };