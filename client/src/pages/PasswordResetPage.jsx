import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPasswordComponent from '../components/PasswordReset';
import Auth from "../utils/auth";

function PasswordResetPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = Auth.loggedIn(); 

        if (isLoggedIn) {
            navigate('/dashboard'); 
        }
    }, [navigate]);

    return (
        <div>
            <ResetPasswordComponent />
        </div>
    );
}

export default PasswordResetPage;