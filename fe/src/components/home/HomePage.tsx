import React, { useState } from 'react';
import Homes from '../homes/Homes';
import Trending from '../trending/Trending';
import Upcomming from '../upcoming/Upcomming';
import { latest, recommended, upcome } from '../../dummyData';

const HomePage: React.FC = () => {
  const [items, setItems] = useState(upcome);
  const [item, setItem] = useState(latest);
  const [rec, setRec] = useState(recommended);

  return (
    <>
      <Homes />
      <Upcomming items={items} title='Upcoming Movies' />
      <Upcomming items={item} title='Latest Movies' />
      <Trending />
      <Upcomming items={rec} title='Recommended Movies' />
    </>
  );
};

export default HomePage;