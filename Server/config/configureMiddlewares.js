require("dotenv").config();
const express = require("express");
const helmet = require("helmet")
const cors = require("cors")
const mongoSanitize = require("express-mongo-sanitize")
const rateLimit = require("express-rate-limit")
const compression = require("compression")


module.exports = function (app) {

    app.use(cors())

    app.options("*", cors())

    app.use(helmet({ contentSecurityPolicy: false }))

    app.use(compression())

    app.use(express.json({ limit: "30mb" }))

    app.use(mongoSanitize())

    const limiter = rateLimit({
        max: 90000,
        windowMs: 15 * 60 * 1000,
        message: "Too many requests from this IP, please try again in 15 mintues!"
    })
    app.use("/api", limiter)

}