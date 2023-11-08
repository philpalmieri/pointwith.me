import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import PokerTable from '../components/PokerTable';
import About from '../components/About';
import withAuthentication from '../containers/withAuthentication';
import '../style.css';

const App = () => {
    console.group('App');
    console.groupEnd();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Login />}/>
                <Route path="/dashboard" element={withAuthentication(Dashboard)}/>
                <Route
                    path="/table/:userId/:tableId"
                    element={withAuthentication(PokerTable)}
                />
                <Route path="/about" element={<About />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
