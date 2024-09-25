import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import "../Styles/Texteditor.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { SiGoogledocs } from "react-icons/si";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Modal from './Modal';
import axios from 'axios';

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    [{ 'title': 'Title' }]
];

const TextEditor = () => {
    const { id: documentId } = useParams();
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const [documentTitle, setDocumentTitle] = useState("Untitled Document");
    const user = useSelector(state => state.login?.User);
    const [colabrattors, setcoll] = useState()
    const [cursors, setCursors] = useState({});
    const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
    const [accessUrl, setAccessUrl] = useState('');

    useEffect(() => {
        const s = io("http://localhost:5000/");
        setSocket(s);
        s.on("connect", () => console.log(`Connected to socket server with ID: ${s.id}`));
        s.on("cursor-update", ({ userId, position }) => {
            setCursors(prevCursors => ({ ...prevCursors, [userId]: position }));
        });
        s.on("disconnect", () => console.log("Socket disconnected"));
        return () => s.disconnect();
    }, []);

    useEffect(() => {
        if (!quill || !socket) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return;
            socket.emit("send-changes", delta);
        };

        quill.on("text-change", handler);
        return () => quill.off("text-change", handler);
    }, [socket, quill]);

    useEffect(() => {
        if (!quill || !socket) return;

        const handler = (delta) => {
            quill.updateContents(delta);
        };

        socket.on("receive-changes", handler);
        return () => socket.off("receive-changes", handler);
    }, [socket, quill]);

    useEffect(() => {
        if (!quill || !socket) return;

        socket.once("load-document", ({ document, title, collabrators }) => {
            quill.setContents(document);
            setDocumentTitle(title || "Untitled Document");
            setcoll(collabrators)
            quill.enable();
        });

        socket.emit("get-document", documentId, user?._id);
    }, [socket, quill, documentId]);

    useEffect(() => {
        if (!quill || !socket) return;

        const interval = setInterval(() => {
            socket.emit("save-document", {
                document: quill.getContents(),
                Title: documentTitle
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [socket, quill]);

    useEffect(() => {
        if (!socket) return;
        socket.emit("save-document-title", { documentId, title: documentTitle });
    }, [documentTitle, socket, documentId]);

    useEffect(() => {
        if (!quill || !socket) return;

        quill.on("text-change", () => {
            const range = quill.getSelection();
            if (range) {
                socket.emit("update-cursor", range.index);
            }
        });
    }, [quill, socket]);

    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: "snow",
            modules: {
                toolbar: toolbarOptions
            }
        });
        q.disable();
        q.setText('Loading...');
        setQuill(q);
    }, []);

    const handleTitleChange = (e) => {
        setDocumentTitle(e.target.value);
    };

    useEffect(() => {
        if (!quill || !socket) return;

        quill.on("text-change", () => {
            const range = quill.getSelection();
            if (range) {
                socket.emit("update-cursor", range.index);
            }
        });
    }, [quill, socket]);

    const getCursorPosition = (index) => {
        const range = quill.getBounds(index);
        return {
            left: range.left + 62,  // Slight offset
            top: range.top + 150,
        };
    };

    const CreateLink = async () => {

        try {
            const responce = await axios.get(`/api/docs/share/${documentId}`)
            console.log(responce);
            setAccessUrl(responce.data.accessurl);
            setModalOpen(true);
        } catch (error) {
            console.log(error.message);
        }
    }




    return (
        <>
            <header className='flex justify-between items-center w-full px-4 py-2 bg-white shadow-md'>
                <div className="flex items-center space-x-2">
                    <SiGoogledocs className='text-blue-600 text-4xl' />
                    <input
                        type="text"
                        className='h-10 border-2 border-gray-300 rounded px-2 focus:outline-none focus:border-blue-500'
                        value={documentTitle}
                        onChange={handleTitleChange}
                        placeholder="Document Title"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <FaRegUserCircle className="w-10 h-10 cursor-pointer" />
                    <div className="flex space-x-1 border-[2px]">
                        <span>Collabrators :</span>
                        {colabrattors?.map((user, index) => (
                            <div className="flex items-center" key={index}>
                                <span className="text-sm text-gray-700">{user.username}</span>
                                {index < colabrattors?.length - 1 && (
                                    <span className="text-gray-400">,</span> // Add a comma between usernames
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={CreateLink} className='border-4 w-24  text-white font-bold p-2 rounded-full bg-blue-500'>Share</button>
                </div>
            </header>

            <div className="container mx-auto mt-4 p-4" ref={wrapperRef} style={{ height: '80vh', overflowY: 'auto' }}>
                {Object.keys(cursors).map(userId => {
                    const { left, top } = getCursorPosition(cursors[userId]);
                    return (
                        <div key={userId} style={{ position: 'absolute', left, top, zIndex: 10 }} className="cursor-indicator">
                            <div style={{ width: '2px', height: '20px', backgroundColor: 'red' }} />
                        </div>
                    );
                })}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                accessUrl={accessUrl}
            />
        </>
    );
}

export default TextEditor;
