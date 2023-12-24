import React, { useState } from 'react';
import Homes from '../homes/Homes';
// import Trending from '../trending/Trending';
import ListFilm from '../listFilm/ListFilm';
import { sport, music, travel } from '../../dummyData';

const HomePage: React.FC = () => {
  const [sports, setSports] = useState(sport);
  const [musics, setSusics] = useState(music);
  const [travels, setTravels] = useState(travel);

  return (
    <div className='m-4'>
      <Homes />
      <ListFilm items={sports} title='Thể thao' itemName='sports' />
      <ListFilm items={musics} title='Âm nhạc' itemName='musics' />
      <ListFilm items={travels} title='Du lịch' itemName='travels' />
    </div>
  );
};

export default HomePage;