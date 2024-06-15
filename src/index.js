import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import AppV4 from './v4/AppV4'; // Import the new component
import AppV3 from './v3/AppV3'; // Import the
import AppV2 from './v2/AppV2'; // Import the new component
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/*<Route path="/chart1" element={<App />} /> {/* This will be rendered at the path '/chart1' 
        <Route path="/chart2" element={<AppV2 />} /> {/*This will be rendered at the path '/chart'
        <Route path="/chart3" element={<AppV3 />} /> This will be rendered at the path '/chart'*/}
        <Route path="/" element={<AppV4 />} /> {/*This will be rendered at the path '/'*/}
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();