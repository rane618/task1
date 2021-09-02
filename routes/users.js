const express = require("express");
const router = express.Router();


//import authorization middleware
const verifyToken = require("../auth/verify");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//use authorization middleware
router.use(verifyToken);

module.exports = router;