import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './components/auth/SignInPage';
import SignUpPage from './components/auth/SignUpPage';
import PrivateRoute from './components/auth/PrivateRouter';
import HomePage from './components/home/HomePage';
import SinglePage from './components/watch/SinglePage';
import Header from './components/header/Header';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign_in" element={<SignInPage />} />
        <Route path="/sign_up" element={<SignUpPage />} />
        <Route
          path="/*"
          element={
            <>
              <Header/>
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="singlepage/:id" element={<SinglePage />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
