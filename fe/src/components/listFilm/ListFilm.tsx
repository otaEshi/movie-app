import React from 'react';
import { Link } from 'react-router-dom';
import ListFilmCard from './ListFilmCard';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@fortawesome/fontawesome-free/css/all.css';

interface ListFilmProps {
  items: Array<{
    id: number;
    cover: string;
    name: string;
    time: string;
  }>;
  title: string;
  itemName: string;
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

const ListFilm: React.FC<ListFilmProps> = ({ items, title, itemName }) => {
  const settings: Settings = {
    dots: false,
    infinite: true,
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
      <section className='upcome pt-4'>
        <div className='container'>
          <div className='heading flexSB'>
            <h1>{title}</h1>
            <Link to={`/tags/${itemName}`}>Xem tất cả</Link>
          </div>
          <div className='content'>
            <Slider {...settings}>
              {items.map((item) => (
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