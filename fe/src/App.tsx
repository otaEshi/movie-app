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
import ProfileContainer from './components/profile/ProfileContainer';
import MovieListContainer from './components/movieList/MovieListContainer';
import AdminContainer from './components/admin/AdminContainer';
import DetailMovieList from './components/movieList/DetailMovieList';
import SearchResultContainer from './components/search/SearchResultContainer';

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
                <Route element={<PrivateRoute />}>
                  <Route path='/profile' element={<ProfileContainer />} />
                  <Route path='/movie_list' element={<MovieListContainer />} />
                  <Route path='/movie_list/detail/:id' element={<DetailMovieList />} />
                  <Route path='/admin' element={<AdminContainer />} />
                </Route>
                <Route path='/tags/*'
                  element={
                    <Routes>
                      <Route path='/Sport' element={<ViewAllPageSport />} />
                      <Route path='/Music' element={<ViewAllPageMusic />} />
                      <Route path='/Travel' element={<ViewAllPageTravel />} />
                    </Routes>
                  }
                >
                </Route>
                <Route path="search_result" element={<SearchResultContainer />} />
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
