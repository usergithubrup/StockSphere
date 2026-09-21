import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './landing_page/home/HomePage';
import {BrowserRouter , Routes , Route} from "react-router-dom";
import Signup from "./landing_page/signup/SignUp";
import Login from "./landing_page/signup/Login";
import PricingPage from "./landing_page/pricing/PricingPage";
import ProductsPage from './landing_page/products/ProductsPage';
import SupportPage from './landing_page/support/SupportPage';
import AboutPage from './landing_page/about/AboutPage';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import NotFound from './landing_page/NotFound';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Navbar/>
     <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/about' element={<AboutPage/>} />
      <Route path='/product' element={<ProductsPage/>}/>
      <Route path='/pricing' element={<PricingPage/>} />
      <Route path='/support' element={<SupportPage/>}/>
      <Route path='/*' element={<NotFound/>}/>
     </Routes>
     <Footer/>
  </BrowserRouter>
);

