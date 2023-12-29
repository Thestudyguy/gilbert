import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/dashboard';
import Pages from './pages/pages';
import "./styles/style.css";
import "bootstrap/dist/css/bootstrap.css";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Pages />
  </React.StrictMode>
);
