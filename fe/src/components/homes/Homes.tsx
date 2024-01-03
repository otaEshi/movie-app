import React, { useEffect, useLayoutEffect, useState } from 'react';
import './home.scss';
import { homeData } from '../../dummyData';
import Home from './Home';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { topTrendingMoviesRequest } from './homeApi';
import { ITrendingMoviesPayload } from '../../types/movies';

const Homes: React.FC = () => {
  const [items, setItems] = useState(useAppSelector(store => store.home.trendingList));

  const dispatch = useAppDispatch();

  // useLayoutEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const payload : ITrendingMoviesPayload = {
  //         top_k : 10
  //       }
  //       console.log('check movie')
  //       console.log(payload)
  //       const res = await dispatch(topTrendingMoviesRequest(payload));
  //       console.log('test')
  //       // Handle the result if needed
  //     } catch (error) {
  //       // Handle errors
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [])

  return (
    <>
      <section className='home'>
        <Home items={items} />
        <div> some thing</div>
      </section>
      <div className='custom-margin'></div>
    </>
  );
};

export default Homes;