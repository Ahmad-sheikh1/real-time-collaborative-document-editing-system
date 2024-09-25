import React from 'react';

const Modal = ({ isOpen, onClose, accessUrl }) => {
    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(accessUrl);
        alert("URL copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-lg font-bold">Shareable Link</h2>
                <p className="mt-2">{accessUrl}</p>
                <button onClick={handleCopy} className="mt-4 bg-blue-500 text-white p-2 rounded">
                    Copy Link
                </button>
                <button onClick={onClose} className="mt-2 ml-2 bg-gray-300 p-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
