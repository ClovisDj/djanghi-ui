import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import history from "../browserHistory"
import Login from "../components/login";
import NotFoundPage from "../components/404";
import Dashboard from "../components/dashboard";

const DjanghiRoutes = () => (
  <BrowserRouter history={history}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Navigate replace to="/dashboard"/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  </BrowserRouter>
);

export default DjanghiRoutes;
