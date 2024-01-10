import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ListFilmTypeDic } from '../home/HomePage';
import { ITrendingMoviesPayload, ITrendingMoviesResponse } from '../../types/movies';
import { topTrendingMoviesRequest, topTrendingMusicRequest, topTrendingSportRequest, topTrendingTravelRequest } from '../homes/homeApi';
import ListFilmCard from './ListFilmCard';

interface ListFilmProps {
  listType: number
}

const SampleNextArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div className='control-btn' onClick={onClick}>
      <button className='next'>
        <i className='fa fa-chevron-right'></i>
      </button>
    </div>
  );
};

const SamplePrevArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div className='control-btn' onClick={onClick}>
      <button className='prev'>
        <i className='fa fa-chevron-left'></i>
      </button>
    </div>
  );
};

const ListFilm: React.FC<ListFilmProps> = ({ listType }) => {
  const dispatch = useAppDispatch();
  const trendingListSport = useAppSelector(store => store.home.trendingListSport);
  const trendingListMusic = useAppSelector(store => store.home.trendingListMusic);
  const trendingListTravel = useAppSelector(store => store.home.trendingListTravel);

  const [listFilm, setListFirm] = useState<ITrendingMoviesResponse>(useAppSelector(store => store.home.trendingListAll));

  // Conditionally assign listFilm based on listType
  const getListFilm = async () => {
    const payload: ITrendingMoviesPayload = {
      top_k: 5,
      genre: ListFilmTypeDic[listType],
      is_deleted: false,
    }
    if (listType === 1) {
      await dispatch(topTrendingSportRequest(payload))
    } else if (listType === 2) {
      await dispatch(topTrendingMusicRequest(payload))
    } else {
      await dispatch(topTrendingTravelRequest(payload))
    }
  }

  useEffect(() => {
    getListFilm()
  }, [])

  useEffect(() => {
    if (listType === 1) {
        setListFirm(trendingListSport);
    } else if (listType === 2) {
        setListFirm(trendingListMusic);
    } else {
        setListFirm(trendingListTravel);
    }
  }, [trendingListSport, trendingListMusic, trendingListTravel])

  const settings: Settings = {
    dots: false,
    infinite: listFilm.movies && listFilm.movies.length > 2,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <section className='upcome pt-5'>
        <div className='container'>
          <div className='heading flexSB'>
            <h1>{ListFilmTypeDic[listType]}</h1>
            <Link to={`/tags/${ListFilmTypeDic[listType]}`}>Xem tất cả</Link>
          </div>
          <div className='content'>
            <Slider {...settings}>
              { listFilm.movies.map((item) => (
                <ListFilmCard key={item.id} item={item} />
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListFilm;