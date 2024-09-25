const express = require("express");
const router = express.Router();
const { GetAllDocs, DelDoc, CreateShareLink, AccessEditDocument } = require("../controllers/Docs.contr")


router.get("/alldocs/:userId", GetAllDocs)
router.delete("/deldoc/:id", DelDoc)
router.get("/share/:DocumentId", CreateShareLink)
router.get("/edit/:DocumentId/:accessToken", AccessEditDocument)


module.exports = router;