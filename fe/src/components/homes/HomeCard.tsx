import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import ReactStars from '../../lib/reactStar/react-star';
import Stars from '../../lib/reactStar/react-star';

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
  const [ratingStar, setRatingStar] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRatingStar(newRating);
    console.log('rating', ratingStar)
  };

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
              {/* <div className='rate'>
                <i className='fas fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
              </div> */}
              {/* <ReactStars 
              count={5}
              size={24}
              color2={'#ffd700'}
              ></ReactStars> */}
              <div className=''>
                 <ReactStars 
                count={5}
                size={24}
                half={true}
                color2={'#e50813'}
                value={ratingStar}
                // edit={false}
                onChange={handleRatingChange}
                // color2={'#ffd700'}
                
                ></ReactStars>
              </div>
              <label>{ratingStar} (đánh giá)</label>
              <label>{time} (thời gian)</label>
            </div>
            <p>{desc}</p>
            <div className='cast'>
              <h4>
                <span>Thể loại: </span>
                {tags}
              </h4>
            </div>
            
          </div>
          <div className='palyButton row'>
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
      </div>
    </>
  );
};

export default HomeCard;