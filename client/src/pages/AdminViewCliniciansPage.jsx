import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from "../utils/auth";
import AdminViewCliniciansComponent from '../components/AdminViewCliniciansComponent';

const AdminPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(Auth.loggedIn());
    const [isAdmin, setIsAdmin] = useState(null); 

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                setIsLoggedIn(Auth.loggedIn());
                if (Auth.loggedIn()) {
                    const user = await Auth.getProfile();
                    setIsAdmin(user.data.isAdmin);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, []);

    useEffect(() => {
        if (isAdmin !== null) {
            if (!isLoggedIn) {
                navigate('/login');
            } else if (!isAdmin) {
                navigate('/not-authorized');
            }
        }
    }, [isAdmin, isLoggedIn, navigate]);

    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn || !isAdmin) {
        return null;
    }

    return (
        <AdminViewCliniciansComponent />
    );
};

export default AdminPage;