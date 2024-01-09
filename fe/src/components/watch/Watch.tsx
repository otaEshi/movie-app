import React, { useState, useEffect } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { homeData, recommended } from '../../dummyData';
import { IMovie } from '../../types/movies';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getMovieRequest, updateMovieViewRequest } from './watchApi';
// import Upcomming from '../listFilm/ListFilm';

// interface IWatchProps {
//   movie: IMovie
// }

// const Watch: React.FC = () => {
function Watch() {
  const { id } = useParams<{ id: string }>();
  const currentMovie = useAppSelector(store => store.watch.movie)
  // const [item, setItem] = useState<Item | null>(null);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (id) {
  //     let foundItem = homeData.find((item) => item.id === parseInt(id));
  //     if (foundItem) {
  //       setItem(foundItem);
  //     }
  //   }
  // }, [id]);

  const getMovie = async () => {
    if (id) {
      await dispatch(getMovieRequest(id));
      dispatch(updateMovieViewRequest(id));
    }
  }

  useEffect(() => {
    getMovie()
  }, [])

  // const [rec, setRec] = useState(recommended);

  return (
    <>
      {currentMovie ? (
        <>
          <section className='watch'>
            <div className='watchHeading'>
              <h1>{currentMovie.title}</h1> <span> | {currentMovie.date_of_release} | </span> <span> HD </span>
            </div>
            <div className='container'>
              <div style={{ height: "600px" }}>
                <iframe
                  src={currentMovie.url}
                  height="100%"
                  allowFullScreen
                >
                </iframe>
                <h3>Ngày phát hành : {currentMovie.date_of_release}</h3>
                <p>Mô tả: {currentMovie.description}</p>
                <div className='comment-container'>
                  <div>temp</div>
                </div>
              </div>
            </div>
          </section>
          {/* <Upcomming items={rec} title='Recommended Movies' /> */}

        </>
      ) : (
        'Xin lỗi vì sự bất tiện này'
      )}
    </>
  );
};

export default Watch;