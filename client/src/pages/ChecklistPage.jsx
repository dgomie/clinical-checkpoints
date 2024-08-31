import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from "../utils/auth";
import ChecklistComponent from '../components/ChecklistComponent';

const ChecklistPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(Auth.loggedIn());

    useEffect(() => {
        setIsLoggedIn(Auth.loggedIn());

        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [navigate, isLoggedIn]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <ChecklistComponent />
    );
};

export default ChecklistPage;