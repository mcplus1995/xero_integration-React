import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Button, Divider } from "@mui/material";
import "react-alice-carousel/lib/alice-carousel.css";
import Logo from "../assets/images/whiteleigh_logo.svg";

import { GoogleMap, useLoadScript, MarkerF, Libraries } from '@react-google-maps/api';
import { useState } from "react";
import instance from "../lib/axios";

import { ToastContainer, toast } from "react-toastify";

const Contact = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const showToast = (message: string, type = "info") => {
        if (type == "error") {
            toast["error"](message);
        } else {
            toast["info"](message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCancel = () => {
        navigate("/");
    };

    async function sendMessagebyEmail() {
        // Check if required fields are filled
        if (!formData.name || !formData.email || !formData.message) {
            showToast("Please fill in all required fields", "error");
            return;
        }

        try {
            const response = await instance.post("/sendMessagebyEmail", {
                formData
            });

            const result = await response.data;

            console.log(result.message);

            if (response.status === 200) {
                // Navigate to the confirmation page on successful email send
                navigate('/confirmation');
            } else {
                // Handle other statuses or show an error message
                console.error('Failed to send email:', response.status);
                showToast("Failed to send email", "error");
            }

            // Clear input values
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
        } catch (error) {
            console.error('Error sending email:', error);
            showToast("Error sending email", "error");
        }
    }

    return (
        <div className="grid grid-cols-1">
            <div className="bg-gray-200 px-4 py-2 sm:px-8 sm:py-4 lg:px-24 lg:py-4 flex flex-col sm:flex-row justify-between items-center">
                <img src={Logo} alt="home" className="mb-4 sm:mb-0" />
            </div>

            <div className="flex flex-col mt-8 py-8 px-12 container mx-auto">
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-lg font-semibold mb-2">
                            Name<span className="text-red-500">*</span>:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-lg font-semibold mb-2">
                            Email<span className="text-red-500">*</span>:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="phone" className="text-lg font-semibold mb-2">
                            Phone (If you want us to call):
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="message" className="text-lg font-semibold mb-2">
                            Message<span className="text-red-500">*</span>:
                        </label>
                        <p className="text-xs mb-2">Existing customers: Include Unit Number</p>
                        <p className="text-xs mb-2">New Customers: Number of Units & Start Date</p>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={6}
                            required
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex justify-between">
                        <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: '#ffd600', color: 'black' }}
                            onClick={sendMessagebyEmail}
                        >
                            Send Message
                        </Button>

                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#fff', color: 'black' }}
                            size="large"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>

            <ToastContainer position="top-center" />
        </div >
    );
};

export default Contact;
