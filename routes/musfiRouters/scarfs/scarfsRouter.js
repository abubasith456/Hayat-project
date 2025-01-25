const express = require("express");
const scarfsController = require("./scarfsController");
const upload = require("../../../utils/multerConfig");
const scarfsRouter = express.Router();

scarfsRouter
    .post("/",
        upload.any(),
        scarfsController.addScarf
    )
    .put("/:id",
        upload.any(),
        scarfsController.updateScarf
    )
    .get("/",
        scarfsController.getScarf
    )
    .get("/:id",
        scarfsController.deleteScarf
    )

module.exports = scarfsRouter;

