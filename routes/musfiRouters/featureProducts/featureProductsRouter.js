const express = require("express");
const hijabsController = require("./featureProductsController");
const upload = require("../../../utils/multerConfig");
const featureRoute = express.Router();

featureRoute
    .post("/",
        upload.any(),
        hijabsController.addFeatureProducts
    )
    .put("/:id",
        upload.any(),
        hijabsController.updateFeatureProducts
    )
    .get("/",
        hijabsController.getFeatureProducts
    )
    .delete("/:id",
        hijabsController.deleteFeatureProducts
    )

module.exports = featureRoute;

