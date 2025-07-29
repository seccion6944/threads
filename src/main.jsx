import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Registrarse from './pages/login.jsx'
import ProtectedRoute from "./componentes/protectedroute.jsx";
import RedirectIfAuth from './componentes/redirectIfauth'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <Registrarse />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

