import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import './listFilm.css';

interface ListFilmCardProps {
  item: {
    id: string | number;
    cover: string;
    name: string;
    time: string;
  };
}

const ListFilm: React.FC<ListFilmCardProps> = ({ item: { id, cover, name, time } }) => {
  return (
    <>
      <div className='MovieBox'>
        <div className='img'>
          <img src={cover} alt='' />
        </div>
        <div className='text'>
          <h3>{name}</h3>
          <span>{time}</span> <br />
          <Link to={`/watch/${id}`} className='custom-text-deco'>
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
    </>
  );
};

export default ListFilm;