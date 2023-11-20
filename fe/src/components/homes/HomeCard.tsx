import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';

interface HomeCardProps {
  item: {
    id: string;
    cover: string;
    name: string;
    rating: number;
    time: string;
    desc: string;
    starring: string;
    genres: string;
    tags: string;
    video: string;
  };
}

const HomeCard: React.FC<HomeCardProps> = ({ item: { id, cover, name, rating, time, desc, starring, genres, tags, video } }) => {
  return (
    <>
      <div className='box'>
        <div className='coverImage'>
          <img src={cover} alt='' />
        </div>
        <div className='content flex'>
          <div className='row'>
            <h1>{name}</h1>
            <div className='rating flex'>
              {/* Modidy rating here */}
              <div className='rate'>
                <i className='fas fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
              </div>
              <label>{rating}(rate count)</label>
              <label>{time}</label>
            </div>
            <p>{desc}</p>
            <div className='cast'>
              <h4>
                <span>Genres </span>
                {genres}
              </h4>
              <h4>
                <span>Tags </span>
                {tags}
              </h4>
            </div>
            
          </div>
          <div className='palyButton row'>
            <Link to={`/singlepage/${id}`} className='custom-text-deco'>
              <button>
                <div className='img'>
                  <img src='./images/play-button.png' alt='' />
                  <img src='./images/play.png' className='change' alt='' />
                </div>
                PLAY NOW
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeCard;