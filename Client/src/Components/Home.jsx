import React, { useEffect, useState } from 'react';
import "../Styles/Home.css";
import { v4 as uuidV4 } from "uuid";
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { AiOutlinePlus, AiOutlineEllipsis } from 'react-icons/ai';
import { SiGoogledocs } from "react-icons/si";
import axios from "axios";
import { useSelector } from 'react-redux';

const Home = () => {
    const [AllDocs, SetAllDocs] = useState([]);
    const [showDropdown, setShowDropdown] = useState(null);
    const navigate = useNavigate();
    const searchQuery = useSelector(state => state.search.query);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const user = useSelector(state => state.login?.User);


    useEffect(() => {
        if (!searchQuery) {
            setFilteredDocs(AllDocs);
        } else {
            setFilteredDocs(
                AllDocs.filter(doc => doc.Title.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
    }, [searchQuery, AllDocs]);

    useEffect(() => {
        const getAllDocs = async () => {
            try {
                const res = await axios.get(`/api/docs/alldocs/${user._id}`);
                SetAllDocs(res.data.AllDocs);
                console.log(res.data);
                
            } catch (error) {
                console.error("Failed to fetch documents", error);
            }
        };
        getAllDocs();
    }, []);

    const handleDropdownClick = (e, index) => {
        e.stopPropagation();
        setShowDropdown(showDropdown === index ? null : index);
    };

    const handleDelete = async (documentId) => {
        try {
            await axios.delete(`/api/docs/deldoc/${documentId}`);
            SetAllDocs(AllDocs.filter(doc => doc.DocumentId !== documentId));
        } catch (error) {
            console.error("Failed to delete document", error);
        }
    };



    return (
        <>
            <Header />
            <main className='px-6 sm:px-12 lg:px-32 py-12 bg-gray-100'>
                <h1 className='text-2xl mb-4 font-bold text-gray-800'>Start New Document</h1>
                <div className="flex flex-col space-y-2 ">
                    <div onClick={() => navigate(`/documents/${uuidV4()}`)} className="relative cursor-pointer w-40 h-52 bg-white border border-gray-300 shadow-lg hover:shadow-xl rounded-md transition duration-200 flex items-center justify-center">
                        <AiOutlinePlus className="text-gray-400" size={48} />
                    </div>
                    <span className="text-lg  text-gray-700">Blank Document</span>
                </div>
            </main>
            {/* All Docs */}
            <section className='px-6 sm:px-12 lg:px-32 py-12 bg-white'>
                <h1 className='text-2xl mb-6 font-semibold text-gray-800'>Recent Documents</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredDocs?.map((doc, index) => (
                        <div onClick={() => navigate(`/documents/${doc.DocumentId}`)} key={index} className="flex flex-col bg-white border border-gray-300 rounded-md shadow-md hover:shadow-lg cursor-pointer p-4 transition duration-200">
                            <div className="flex relative justify-center items-center bg-blue-50 rounded-md h-32">
                                <SiGoogledocs className="text-blue-600" size={64} />
                            </div>
                            <div className="mt-4">
                                <p className="text-md font-semibold text-gray-800 truncate">{doc.Title}</p>
                                <p className="text-sm text-gray-500">{new Date(doc.lastUpdated).toLocaleDateString()}</p>
                            </div>
                            <button
                                className="text-gray-600 hover:text-gray-900 focus:outline-none mt-2"
                                onClick={(e) => handleDropdownClick(e, index)}
                            >
                                <AiOutlineEllipsis size={32} />
                            </button>
                            {showDropdown === index && (
                                <div className="bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(doc._id);
                                        }}
                                        className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default Home;
