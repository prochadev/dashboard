import React from 'react';
import {Routes, Route} from 'react-router-dom';

import Games from '../components/games/Games';
import Players from '../components/user/Players';

export default props => (
    <Routes>
        <Route exact path="/" element={<Games />} />
        <Route path="/users" element={<Players />} />
        <Route path="*" element={<Games />} />
    </Routes>
);