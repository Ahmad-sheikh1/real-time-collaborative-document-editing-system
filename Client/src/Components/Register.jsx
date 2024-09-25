import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        passwordHash: '',
        profilePicture: '',
        phoneNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: ''
        },
        bio: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                profilePicture: URL.createObjectURL(file)
            }));
        }
    };
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const res = await axios.post("/api/user/register", formData);
            if (res.data.data) {
                navigate("/login")
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">Register User</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="passwordHash" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            id="passwordHash"
                            name="passwordHash"
                            value={formData.passwordHash}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="profilePicture" className="block text-gray-700">Profile Picture</label>
                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-4"
                        />
                        {formData.profilePicture && (
                            <img
                                src={formData.profilePicture}
                                alt="Profile Preview"
                                className="mt-4 w-32 h-32 object-cover rounded-full"
                            />
                        )}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            name="street"
                            placeholder="Street"
                            value={formData.address.street}
                            onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, street: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.address.city}
                            onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, city: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={formData.address.state}
                            onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, state: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        />
                        <input
                            type="text"
                            name="postalCode"
                            placeholder="postalCode"
                            value={formData.address.postalCode}
                            onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, postalCode: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-gray-700">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
