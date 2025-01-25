const scarfs = require("../../../Database/mufiModels/scarfs");
const { AppError } = require("../../../utils/AppError");
const catchAsyncError = require("../../../utils/catchAsyncError");
const firebase = require("../../../utils/firebase");
const { responseFetchProduct } = require("../../../utils/responseModel");


const addScarf = catchAsyncError(async (req, res, next) => {
    try {

        let imageUrls = [];
        for (let file of req.files) {
            const imageName = file.filename;
            const imagePath = file.path
            let imageUrl = '';
            await firebase.uploadFile(imagePath, "scarfs/" + imageName);
            await firebase.generateSignedUrl("scarfs/" + imageName)
                .then(url => {
                    imageUrl = url;
                })
                .catch(e => {
                    console.log(e);
                });

            imageUrls.push(imageUrl);  // Collect the signed URLs of the images
        }

        const addProduct = new scarfs({
            ...req.body,  // Get non-file data from req.body
            images: imageUrls,  // Save the image URLs
        });
        await addProduct.save();

        res.status(201).json({ message: "success", addProduct });
    } catch (e) {
        res.status(500).json({ message: e.message });

    }
});

const updateScarf = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;  // Get the hijab ID from the route params

        // Find the hijab by ID in the database
        const scarf = await scarfs.findById(id);
        if (!scarf) {
            return res.status(404).json({ message: "Hijab not found." });
        }

        // Process file uploads (if any)
        let imageUrls = scarf.image; // Keep old images if no new ones are uploaded
        if (req.files && req.files.length) {
            imageUrls = [];  // Clear existing images if new ones are uploaded
            for (let file of req.files) {
                let imageUrl = '';
                await firebase.uploadFile(file.path, "scarfs/" + file.filename);
                await firebase.generateSignedUrl("scarfs/" + file.filename)
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
        scarf.name = req.body.name || scarf.name;  // Keep old name if no new name
        scarf.percentage = req.body.percentage || scarf.percentage;  // Keep old percentage if no new percentage
        scarf.images = imageUrls;  // Update images

        // Save the updated product
        await scarf.save();

        res.status(200).json({ message: "Scarf updated successfully", scarfs: scarf });
    } catch (e) {
        res.status(500).json({ message: "Failed", error: e.message });
    }
});

const getScarf = catchAsyncError(async (req, res, next) => {
    scarfs.find()
        .exec()
        .then(result => {
            res.status(200).send(responseFetchProduct(true, result));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(responseFetchProduct(false, err));
        });
});

const deleteScarf = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    scarfs.deleteOne({ _id: id })
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

module.exports = { addScarf , updateScarf , getScarf , deleteScarf  };