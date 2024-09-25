import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Quill from 'quill';
import "quill/dist/quill.snow.css";


const DocumentEditor = () => {
    const { DocumentId, accessToken } = useParams(); // Extract from URL parameters
    const [quill, setQuill] = React.useState(null);

    useEffect(() => {
        // Initialize Quill editor
        const editor = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: [
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
                ]
            }
        });
        setQuill(editor);

        // Fetch document content from the server using access URL
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`/api/docs/edit/${DocumentId}/${accessToken}`);
                const documentContent = response.data.document; // Adjust based on your API response structure

                // Set the document content in Quill
                if (editor) {
                    editor.setContents(documentContent); // Assuming documentContent is in Delta format
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchDocument();

        return () => {
            // Cleanup if necessary
        };
    }, [DocumentId, accessToken]); // Dependency array to run the effect when these params change

    return (
        <div>
            <div id="editor" style={{ height: '80vh' }}></div>
        </div>
    );
};

export default DocumentEditor;
