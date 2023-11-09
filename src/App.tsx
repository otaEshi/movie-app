import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './components/auth/SignInPage';
import SignUpPage from './components/auth/SignUpPage';
import PrivateRoute from './components/auth/PrivateRouter';
import HomePage from './components/home/HomePage';
import SinglePage from './components/watch/SinglePage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route element={<PrivateRoute />}>
          {/* Private routes go here */}
        </Route>
        <Route path='/sign_in' element={<SignInPage />} />
        <Route path='/sign_up' element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/singlepage/:id" element={<SinglePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
