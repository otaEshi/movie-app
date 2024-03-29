import React, { useEffect, useState } from 'react';
import Homes from '../homes/Homes';
// import Trending from '../trending/Trending';
// import ListFilm from '../listFilm/ListFilm';
import { sport, music, travel } from '../../dummyData';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useFetchData from '../../hook/useFetchData';
import ListFilm from '../listFilm/ListFilm';
import { getMovieList, getMovieListPublic } from '../movieList/movieListApi';
import { IMovieListPublic } from '../../types/movieList';
import MovieListSlide from '../movieList/MovieListSlide';

export const ListFilmTypeDic: Record<number, string> = {
  1: 'Thể thao',
  2: 'Âm nhạc',
  3: 'Du lịch',
};

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const publicList = useAppSelector(store => store.movieList.public_list)

  const getPublicMovieList = async () => {
    const payload: IMovieListPublic = {
      page: 0,
      page_size: 9999,
      is_deleted: false,
    }
    await dispatch(getMovieListPublic(payload))
  }

  useEffect(() => {
    getPublicMovieList()
    getPersonalMovieList()
  }, [])

  const getPersonalMovieList = async () => {
    const payload: IMovieListPublic = {
        page: 0,
        page_size: 9999,
        is_deleted: false,
    }
    await dispatch(getMovieList(payload))
}

useEffect(() => {
    getPersonalMovieList()
}, [])

  // const dispatch = useAppDispatch();
  console.log("DEBUG  ")
  console.log(publicList.list)
  return (
    <>
      <div className='m-4'>
        <Homes />
        {/* type: 0 - all, 1-sport , 2-musics, 3-travels */}
        <ListFilm listType={1} />
        <ListFilm listType={2} />
        <ListFilm listType={3} />
        {publicList.list && publicList.list.map((item) => (
           <MovieListSlide key={item.id} movieList={item}></MovieListSlide>
        ))}
        {/* {publicList.list.length>0 && <MovieListSlide movieList={publicList.list[0]}></MovieListSlide>} */}
      </div>

          
    </>
  );
};

export default HomePage;