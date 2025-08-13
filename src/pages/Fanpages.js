import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import client from '../Client';

import Fanpage from '../components/loops/Fanpage';

const getFanpages = async () => {
  const { data } = await client.get('/fanpages');
  return data;
};

const Fanpages = () => {
  const [fanpages, setFanpages] = useState([]);

  useEffect(() => {
    getFanpages().then(setFanpages).catch(console.error);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Danh mục fanpage</title>
      </Helmet>
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {fanpages.map((fanpage, i) => ( <Fanpage key={i} fanpage={fanpage} /> ))}
      </div>
    </>
  );
};

export default Fanpages;
