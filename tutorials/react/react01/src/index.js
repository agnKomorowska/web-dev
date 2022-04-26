import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Heading from './components/heading/Heading';
import App from './App';
import Footer from './components/footer/Footer';
import reportWebVitals from './reportWebVitals';
import HeadingStyledComponent from './components/headingStyledComponents/HeadingStyledComponent';

const companyData = {
  email: "contact@example.com", 
  city: "Warsaw",
  street: "Ujazdowskie",
  number: 24
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Heading headerTitle="Welcome on our page!"/>
    <HeadingStyledComponent></HeadingStyledComponent>
    <App />
    <Footer email="email@example.com" companyData = { companyData } />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
