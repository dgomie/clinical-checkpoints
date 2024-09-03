import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordComponent from '../components/ForgotPasswordComponent';
import Auth from "../utils/auth";

function ForgotPasswordPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = Auth.loggedIn(); 

        if (isLoggedIn) {
            navigate('/dashboard'); 
        }
    }, [navigate]);

    return (
        <div>
            <ForgotPasswordComponent />
        </div>
    );
}

export default ForgotPasswordPage;