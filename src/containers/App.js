import React from 'react';
import {BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes} from 'react-router-dom';

import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import PokerTable from '../components/PokerTable';
import About from '../components/About';
import withAuthentication from '../containers/withAuthentication';
import '../style.css';

const router = createBrowserRouter([
    {path: "/", Component: Login},
    {path: "/about", Component: About},
    {path: "/dashboard", Component: Dashboard},
    {path: "/table/:userId/:tableId", Component: PokerTable},
])

const App = () => {
    return <RouterProvider router={router} />;
}

export default App;
