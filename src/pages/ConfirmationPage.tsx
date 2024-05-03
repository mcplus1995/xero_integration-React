import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const ConfirmationPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-lg font-semibold mb-4">Thank you for contacting Whiteleigh Storage.</h1>
            <p className="mb-8">We will reply as soon as possible.</p>
            <Button variant="contained" onClick={() => navigate('/')}>
                HOME
            </Button>
        </div>
    );
};

export default ConfirmationPage;