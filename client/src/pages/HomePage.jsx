import HomeComponent from '../components/HomeComponent';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';

function HomePage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const isLoggedIn = Auth.loggedIn();

    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      setAuthChecked(true);
    }
  }, [navigate]);

  if (!authChecked) {
    return null;
  }

  return (
    <>
      <HomeComponent />
    </>
  );
}

export default HomePage;