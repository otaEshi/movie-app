import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import ReactStars from '../../lib/reactStar/react-star';
import Stars from '../../lib/reactStar/react-star';
import { IMovie } from '../../types/movies';

interface HomeCardProps {
  item: IMovie
}

// id: number;
// title: string;
// description: string;
// thumbnail_url: string;
// url: string;
// genre: string;
// subgenre: string;
// source: string;
// views: number;
// date_of_release: string;
// is_deleted: boolean;
// userRating?: number;
// globalRaing: number;

function HomeCard(props: HomeCardProps) {
// const HomeCard: React.FC<HomeCardProps> = ({ item: { id, cover, name, userRating, globalRating, time, desc, genres, subGenre, videoURL } }) => {
  const [ratingStar, setRatingStar] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRatingStar(newRating);
    console.log('rating', ratingStar)
  };

  return (
    <>
      <div className='box'>
        <div className='coverImage'>
          <img src={props.item.thumbnail_url} alt='' />
        </div>
        <div className='content flex'>
          <div className='row'>
            <h1>{props.item.title}</h1>
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
                value={props.item.userRating ? props.item.userRating : props.item.globalRating}
                // edit={false}
                onChange={handleRatingChange}
                // color2={'#ffd700'}
                
                ></ReactStars>
              </div>
              <label>{props.item.globalRating} (đánh giá)</label>
              <label>{props.item.date_of_release} (thời gian)</label>
            </div>
            <p>{props.item.description}</p>
            <div className='cast'>
              <h4>
                <span>Thể loại: </span>
                {props.item.genre}
                {props.item.subgenre}
              </h4>
            </div>
            
          </div>
          <div className='palyButton row'>
            <Link to={`/watch/${props.item.id}`} className='custom-text-deco'>
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