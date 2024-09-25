const DocumentModel = require("../models/Document.model")
const crypto = require('crypto');

const GetAllDocs = async (req, res) => {
    try {
        const { userId } = req.params;
        const AllDocs = await DocumentModel.find({ Author: userId })
            .populate('Author', 'email username')
            .populate('collaborators', 'email username')
        res.status(200).json({ message: "Succeed", AllDocs })
    } catch (error) {
        console.log(error.message);
        res.json({ messgae: error.message })
    }
};

const DelDoc = async (req, res) => {
    try {
        const { id } = req.params
        const DelDoc = await DocumentModel.findOneAndDelete({ _id: id });
        if (!DelDoc) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json({ message: "Succeed", DelDoc })
    } catch (error) {
        console.log(error.message);
        res.json({ messgae: error.message })
    }
}

const CreateShareLink = async (req, res) => {
    try {

        const { DocumentId } = req.params;

        const document = await DocumentModel.findOne({ DocumentId });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const accesstoken = crypto.randomBytes(32).toString('hex');

        const accessurl = `http://localhost:5173/api/docs/edit/${DocumentId}/${accesstoken}`;

        document.accessurl = accessurl;
        document.accessToken = accesstoken;
        await document.save();

        res.json({ accessurl });

    } catch (error) {
        console.log(error.message);
        res.json({ messgae: error.message })
    }
}

const AccessEditDocument = async (req, res) => {
    try {
        const { DocumentId, accessToken } = req.params;

        if (!DocumentId || !accessToken) {
            res.json({ message: "Wrong URL" });
        }

        const document = await DocumentModel.findOne({ DocumentId, accessToken })

        if (!document) {
            return res.status(403).json({ error: 'Invalid access' });
        }

        res.json({ document });

    } catch (error) {
        console.log(error.message);
        res.json({ messgae: error.message })
    }
}

module.exports = {
    GetAllDocs,
    DelDoc,
    CreateShareLink,
    AccessEditDocument
}