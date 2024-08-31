import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegistrationForm.css';  // Import the CSS file for styling

const RegistrationForm = () => {
    const [employeeCode, setEmployeeCode] = useState('');
    const [fullName, setFullName] = useState('');
    const [designation, setDesignation] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [photograph, setPhotograph] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchCaptcha = async () => {
            try {
                const response = await axios.get('http://localhost:4000/captcha');
                setCaptcha(response.data.captcha);
            } catch (error) {
                console.error('Error fetching CAPTCHA:', error);
            }
        };

        fetchCaptcha();
    }, []);

    const handleFileChange = (e) => {
        setPhotograph(e.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const formData = new FormData();
            formData.append('employee_code', employeeCode);
            formData.append('username', username);
            formData.append('password', password);
            formData.append('captchaInput', captchaInput);
            formData.append('full_name', fullName);
            formData.append('designation', designation);
            formData.append('specialty', specialty);
            if (photograph) formData.append('photograph', photograph);

            const response = await axios.post('http://localhost:4000/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccessMessage(response.data);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-form-container">
            <h3>Registration Form</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Employee Code:
                    <input type="text" value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} required />
                </label>
                <br />
                <label>
                    Full Name:
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </label>
                <br />
                <label>
                    Designation:
                    <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
                </label>
                <br />
                <label>
                    Specialty:
                    <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
                </label>
                <br />
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <br />
                <label>
                    CAPTCHA: <strong>{captcha}</strong>
                </label>
                <br />
                <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} required />
                <br />
                <label>
                    Photograph:
                    <input type="file" onChange={handleFileChange} />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Register'}
                </button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default RegistrationForm;
