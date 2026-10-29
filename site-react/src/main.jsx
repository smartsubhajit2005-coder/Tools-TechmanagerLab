import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { Agentation } from 'agentation';
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Agentation endpoint="http://localhost:4747" />
  </BrowserRouter>
);
