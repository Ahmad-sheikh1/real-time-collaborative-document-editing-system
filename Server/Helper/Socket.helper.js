const DocumentModel = require("../models/Document.model");
const mongoose = require("mongoose");

module.exports = (io) => {

    io.on("connection", (socket) => {
        console.log("New Socket Connected".blue.bold, socket.id);
        socket.on("get-document", async (documentId, userid) => {
            const document = await findorcreateDocument(documentId, userid);
            console.log(document.collaborators);

            const userObjectId = new mongoose.Types.ObjectId(userid);
            if (!document.collaborators.some(collaborator => collaborator._id.equals(userObjectId)) && document.Author.toString() !== userid) {
                console.log(document.Author.toString() !== userid, "j");
                console.log(!document.collaborators.includes(userObjectId), "k");

                document.collaborators.push(userObjectId); // Use the ObjectId
                await document.save();
            }
            socket.join(documentId)
            socket.emit("load-document", {
                document: document.Content,
                title: document.Title,
                collabrators: document.collaborators,
                lastUpdated: document.lastUpdated
            });
            // Handle cursor updates
            socket.on("update-cursor", (position) => {
                socket.broadcast.to(documentId).emit("cursor-update", { userId: userid, position });
            });
            socket.on("send-changes", delta => {
                socket.broadcast.to(documentId).emit("receive-changes", delta)
            })
            socket.on("save-document", async (data) => {
                console.log("Saving document:", data);
                await DocumentModel.findOneAndUpdate(
                    { DocumentId: documentId },
                    { Content: data.document, Title: data.title, lastUpdated: document.lastUpdated },
                    { new: true }
                );
            });
            socket.on("save-document-title", async ({ documentId, title }) => {
                await DocumentModel.findOneAndUpdate(
                    { DocumentId: documentId },
                    { Title: title, lastUpdated: document.lastUpdated },
                    { new: true }
                );
            });
        })
    })

}

const defaultvalue = {};

const findorcreateDocument = async (id, userid) => {

    if (id == null) return

    const document = await DocumentModel.findOne({ DocumentId: id }).populate('collaborators', 'email username')
    console.log('Found Document:', document);
    if (document) return document;

    return await DocumentModel.create({ DocumentId: id, Content: defaultvalue, Title: "Untitled Document", Author: userid, lastUpdated: Date.now() })

}