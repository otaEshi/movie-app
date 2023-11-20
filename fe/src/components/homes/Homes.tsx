import React, { useState } from 'react';
import './home.scss';
import { homeData } from '../../dummyData';
import Home from './Home';

const Homes: React.FC = () => {
  const [items, setItems] = useState(homeData);

  return (
    <>
      <section className='home'>
        <Home items={items} />
        <div> some thing</div>
      </section>
      <div className='custom-margin'></div>
    </>
  );
};

export default Homes;