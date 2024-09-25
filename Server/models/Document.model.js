const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");


const DocumentSchema = new Schema({
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Content: {
        type: Object,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now // Default to current date/time
    },
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    DocumentId: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        default: 'Untitled Document'
    },
    accessurl: {
        type: String
    },
    accessToken : String,
}, {
    timestamps: true
});


module.exports = model("DocumentModel", DocumentSchema)