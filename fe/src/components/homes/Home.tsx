import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HomeCard from './HomeCard';
import '@fortawesome/fontawesome-free/css/all.css';
import { IMovie, ITrendingMoviesResponse } from '../../types/movies';

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


interface HomeProps {
  items: ITrendingMoviesResponse; 
}

const Home: React.FC<HomeProps> = ({ items }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <div className='homeContainer'>
        <Slider {...settings}>
          {items.movies.map((item: IMovie) => (
            <React.Fragment key={item.id}>
              <HomeCard item={item} />
            </React.Fragment>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Home;