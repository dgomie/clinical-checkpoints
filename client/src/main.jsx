import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginPage.jsx';
import SignUpPage from './pages/signUpPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ChecklistPage from './pages/ChecklistPage.jsx';


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
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'checklist',
        element: <ChecklistPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
