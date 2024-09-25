const express = require("express");
const router = express.Router();
const { RegisterUser, VerifyTokenController, LoginUser } = require("../controllers/User.contr");


router.post("/register", RegisterUser);
router.post("/Login", LoginUser)
router.post("/verifytoken" , VerifyTokenController)



module.exports = router;