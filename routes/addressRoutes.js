const express = require("express");
const {
  createAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const router = express.Router();

router.post("/", createAddress);
router.post("/addresses/:userId", getAllAddress);
router.post("/addresses/:id", updateAddress);
router.post("/addresses/:id", deleteAddress);

module.exports = router;
