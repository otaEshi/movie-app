import React, { useState, useEffect } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { homeData, recommended } from '../../dummyData';
import Upcomming from '../upcoming/Upcomming';

interface Item {
  id: number;
  name: string;
  time: string;
  video: string;
  date: string;
  desc: string;
}

const SinglePage: React.FC = () => {
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

  const [rec, setRec] = useState(recommended);

  return (
    <>
      {item ? (
        <>
          <section className='singlePage'>
            <div className='singleHeading'>
              <h1>{item.name}</h1> <span> | {item.time} | </span> <span> HD </span>
            </div>
            <div className='container'>
              <video src={item.video} controls></video>
              <div className='para'>
                <h3>Date : {item.date}</h3>
                <p>{item.desc}</p>
                <p>
                  Get access to the direct Project Overview with this report. Just by a quick glance, you’ll have an
                  idea of the total tasks allotted to the team, number of milestones given & completed, total Links
                  created for the project and the total time taken by all the users. Each section would elaborate the
                  data further, if chosen.
                </p>
                <p>
                  Get access to the direct Project Overview with this report. Just by a quick glance, you’ll have an
                  idea of the total tasks allotted to the team, number of milestones given & completed, total Links
                  created for the project and the total time taken by all the users. Each section would elaborate the
                  data further, if chosen.
                </p>
                <p>
                  Get access to the direct Project Overview with this report. Just by a quick glance, you’ll have an
                  idea of the total tasks allotted to the team, number of milestones given & completed, total Links
                  created for the project and the total time taken by all the users. Each section would elaborate the
                  data further, if chosen.
                </p>
              </div>
              <div className='soical'>
                <h3>Share:</h3>
                <img src='https://img.icons8.com/color/48/000000/facebook-new.png' alt='Facebook Icon' />
                <img src='https://img.icons8.com/fluency/48/000000/twitter-circled.png' alt='Twitter Icon' />
                <img src='https://img.icons8.com/fluency/48/000000/linkedin-circled.png' alt='LinkedIn Icon' />
              </div>
            </div>
          </section>
          <Upcomming items={rec} title='Recommended Movies' />
        </>
      ) : (
        'no'
      )}
    </>
  );
};

export default SinglePage;