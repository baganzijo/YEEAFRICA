import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './Context/AuthContext.jsx'; // ✅ correct path

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <App />
        <ToastContainer position="top-center" />
        <Toaster position="top-center" />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
