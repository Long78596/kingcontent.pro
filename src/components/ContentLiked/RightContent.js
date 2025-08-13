import React, { useEffect, useState, memo } from 'react';
import HashtagsSearch from './HashtagsSearch';
import { Link } from 'react-router-dom';
import client from '../../Client';

const getFanpages = async () => {
  const { data } = await client.get('/fanpages?_limit=7');
  return data;
};

const RightContent = (props) => {
  const baseURL = process.env.API_URL;

  const [fanpages, setFanpages] = useState([]);

  useEffect(() => {
    getFanpages().then(setFanpages);
  }, []);

  const fanpageRows = [];
  fanpages.map((f) => {
    fanpageRows.push(
      <div className="pt-3 float-left w-full" key={f._id}>
        <Link to={`/danh-muc/${f.category.slug}?fb_id=${f.fb_id}`}>
          <div className="w-4/5 float-left">
            <img
              src={baseURL + (f.avatar ? f.avatar.url : '')}
              className="w-20 h-20 float-left"
            />
            <span className="font-bold pl-3 inline-block align-middle h-20 table-cell">
              {f.name}
            </span>
          </div>
          <div className="w-1/5 float-right">
            <span className="w-full pl-10 inline-block align-middle h-20 table-cell">
              {Math.floor(Math.random() * 100)}
            </span>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <div className="w-2.4/10 mt-5 float-right">
      <div className="rounded-md p-3 bg-white shadow-smBlackShadow">
        <div className="title w-full">
          <h2 className="text-base font-bold">Fanpage chứa content đã thích</h2>
        </div>
        <div className="">{fanpageRows}</div>
        <br className="clear-both" />
      </div>

      <div className="rounded-md mt-5 p-3 bg-white shadow-smBlackShadow">
        <HashtagsSearch />
        <br className="clear-both" />
      </div>
    </div>
  );
};

export default memo(RightContent);
