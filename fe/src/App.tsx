import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './components/auth/SignInPage';
import SignUpPage from './components/auth/SignUpPage';
import PrivateRoute from './components/auth/PrivateRouter';
import HomePage from './components/home/HomePage';
import Header from './components/header/Header';
import Watch from './components/watch/Watch';
import ViewAllPage from './components/viewAllPage/ViewAllPageSport';
import ViewAllPageSport from './components/viewAllPage/ViewAllPageSport';
import ViewAllPageMusic from './components/viewAllPage/ViewAllPageMusic';
import ViewAllPageTravel from './components/viewAllPage/ViewAllPageTravel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/sign_in" element={<SignInPage />} /> */}
        {/* <Route path="/sign_up" element={<SignUpPage />} /> */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                <Route index element={<HomePage />} />
                <Route path='/tags/*'
                  element={
                    <Routes>
                      <Route path='/sports' element={<ViewAllPageSport />} />
                      <Route path='/musics' element={<ViewAllPageMusic />} />
                      <Route path='/travels' element={<ViewAllPageTravel />} />
                    </Routes>
                  }
                >
                </Route>
                <Route path="watch/:id" element={<Watch />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
