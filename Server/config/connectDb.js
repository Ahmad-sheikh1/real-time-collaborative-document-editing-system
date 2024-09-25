require("dotenv").config()
const mongoose = require("mongoose")
require("colors");

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.1o1wb3p.mongodb.net/${process.env.NAME_DB}`, {
            connectTimeoutMS: 30000
        })
        console.log("Connected to MongoDB".green.bold)
    } catch (error) {
        console.error("Error connecting to MongoDB:".red.bold, error.message)
    }
}

module.exports = connectDB;