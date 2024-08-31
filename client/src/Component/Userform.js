import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import './UserForm.css'; // Import the CSS file for styling

const UserForm = () => {
    const [formType, setFormType] = useState(null);

    const handleButtonClick = (type) => {
        setFormType(type);
    };

    return (
        <div className="user-form-container">
            {formType === null && (
                <div className="button-container">
                    <button className="form-button" onClick={() => handleButtonClick('register')}>Register</button>
                    <button className="form-button" onClick={() => handleButtonClick('login')}>Login</button>
                </div>
            )}

            {formType === 'register' && <RegistrationForm />}
            {formType === 'login' && <LoginForm />}
        </div>
    );
};

export default UserForm;
