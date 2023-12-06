import React, { useState, useEffect } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { homeData} from '../../dummyData';
import Upcomming from '../listFilm/ListFilm';

interface Item {
  id: number;
  name: string;
  time: string;
  video: string;
  date: string;
  desc: string;
}

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (id) {
      let foundItem = homeData.find((item) => item.id === parseInt(id));
      if (foundItem) {
        setItem(foundItem);
      }
    }
  }, [id]);

  // const [rec, setRec] = useState(recommended);

  return (
    <>
      {item ? (
        <>
          <section className='watch'>
            <div className='watchHeading'>
              <h1>{item.name} (name) </h1> <span> | {item.time} (time) </span> 
            </div>
            <div className='container'>
              <div style={{height:"600px"}}>
                 <iframe 
                src={item.video}
                height="100%" 
                allowFullScreen
                allow='autoplay mute'
                
                >
                </iframe> 
                <h3>Date : {item.date}</h3>
                <p>{item.desc}</p>
              </div>
              {/* <div className=''> */}
                
              {/* </div> */}
              
            </div>
          </section>
        </>
      ) : (
        'not found'
      )}
    </>
  );
};

export default Watch;