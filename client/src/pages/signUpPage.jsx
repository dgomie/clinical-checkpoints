import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from "../components/SignUp";
import Auth from "../utils/auth";

function SignUpPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = Auth.loggedIn();

        if (isLoggedIn) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div>
            <SignUp />
        </div>
    );
}


export default SignUpPage;
