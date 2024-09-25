import React, { useState } from 'react';
import { SiGoogledocs } from "react-icons/si";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../Store/Slices/SearchSlice';
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleSearchChange = (e) => {
        console.log(e.target.value);
        dispatch(setSearchQuery(e.target.value));
    };

    const IoLogOut = () => {
        localStorage.removeItem("token");
        navigate('/login');
    };

    return (
        <header className='flex justify-between items-center px-4 py-2 bg-white shadow-md'>
            <div className="flex items-center gap-2">
                <SiGoogledocs className='text-blue-500 text-4xl' />
                <h1 className='text-3xl text-gray-800 font-bold'>Docs</h1>
            </div>
            <div className="relative flex items-center">
                <IoSearchOutline className='absolute left-3 text-gray-400' />
                <input
                    type="text"
                    className="pl-10 border w-full max-w-xs border-gray-300 rounded-full py-2 px-3 focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                />
            </div>
            <div className='flex gap-4 justify-start items-center'>
                <span>Logout</span>
                <div onClick={ IoLogOut} className="relative w-8 h-8 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
                        <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                    </svg>
                </div>
            </div>
        </header>
    );
};

export default Header;
