import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext'; 
import 'leaflet/dist/leaflet.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider> {/*  Wrap App inside ThemeProvider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
