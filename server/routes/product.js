const express = require("express");
const router = express.Router();

const{ editProduct,viewProduct,deleteImage}= require("../controller/product");
const {verifyToken} = require("../middleware/auth");

router.post("/view", viewProduct);
router.use(verifyToken);
router.put("/edit", editProduct);
router.delete("/deleteImage",deleteImage)
module.exports = router;
