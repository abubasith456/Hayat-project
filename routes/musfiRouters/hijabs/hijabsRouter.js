const express = require("express");
const hijabsController = require("./hijabsController");
const upload = require("../../../utils/multerConfig");
const hijabRouter = express.Router();

hijabRouter
    .post("/",
        upload.any(),
        hijabsController.addHijab
    )
    .put("/:id",
        upload.any(),
        hijabsController.updateHijab
    )
    .get("/",
        hijabsController.getHijabs
    )
    .get("/:id",
        hijabsController.deleteHijabs
    )

module.exports = hijabRouter;

