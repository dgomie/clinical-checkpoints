import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginPage.jsx';
import SignUpPage from './pages/signUpPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CheckpointsPage from './pages/CheckpointsPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import PasswordResetPage from './pages/PasswordResetPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AdminViewCliniciansPage from './pages/AdminViewCliniciansPage.jsx';
import AdminSchedulePage from './pages/AdminSchedulePage.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signUp',
        element: <SignUpPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password/:token',
        element: <PasswordResetPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'checkpoints',
        element: <CheckpointsPage />,
      },
      {
        path: 'checkpoints/:checkpointId',
        element: <CheckpointsPage />,
      },
      {
        path: 'admin',
        element: <AdminPage />
      },
      {
        path: 'admin/view-clinicians',
        element: <AdminViewCliniciansPage />
      },
      {
        path: 'admin/view-schedule',
        element: <AdminSchedulePage />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
