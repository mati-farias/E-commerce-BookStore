const express = require('express');
const { Router } = require('express');
const bookRoutes = require("./books");
const userRoutes = require("./user");
const {	allGenres } = require("../controllers/bookControllers");
/* GET home page. */

const router = Router();

router.use("/books", bookRoutes);

router.use("/user", userRoutes);

router.get('/genres', allGenres);

module.exports = router;
