import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import './listFilm.css';
import { homeData } from '../../dummyData';
import { HomeCardProps } from '../homes/HomeCard';

interface ListFilmCardProps {
  item: {
    id: string | number;
    cover: string;
    name: string;
  };
}


const ListFilm: React.FC<ListFilmCardProps> = ({ item: { id, cover, name } }) => {
  const [chosenVid, setChosenVid] = useState<any>();
  
  return (
    <>
      <div className='MovieBox' onClick={() => {
        console.log(name)
        let foundItem = homeData.find((item) => item.id === id);
        setChosenVid(foundItem);
        // render home card in a modal

      }}>
        <div className='img'>
          <img src={cover} alt='' />
        </div>
        <div className='text'>
          <h3>{name}</h3>
          {/* <span>{time}</span> <br /> */}
          <Link to={`/watch/${id}`} className='custom-text-deco'>
            <button>
              <div className='img'>
                <img src='./images/play-button.png' alt='' />
                <img src='./images/play.png' className='change' alt='' />
              </div>
              CHƠI NGAY
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ListFilm;