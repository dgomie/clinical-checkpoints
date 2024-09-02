import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from "../utils/auth";
import CheckpointsComponent from '../components/CheckpointsComponent';

const CheckpointsPage = () => {
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
        <CheckpointsComponent />
    );
};

export default CheckpointsPage;