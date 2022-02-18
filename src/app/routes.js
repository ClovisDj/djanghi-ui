import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import history from "../browserHistory"
import Login from "../components/login";
import Dashboard from "../components/dashboard/dashboard"

const DjanghiRoutes = () => (
  <BrowserRouter history={history}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Navigate replace to="/dashboard"/>} />
    </Routes>
  </BrowserRouter>
);

export default DjanghiRoutes;
