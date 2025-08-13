import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import client from '../Client';
import Content from '../components/SpecialFollow/Content';
import SpecialFollowPopup from '../components/SpecialFollow/Popup';
import Search from '../components/SpecialFollow/Search';
import { SpecialService } from '../services/special';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import { OK } from '../configs';

const getFanpages = async () => {
  const { data } = await client.get(`/saved-fanpages`);
  return data.data;
};

const SpecialFollow = (props) => {
  const initialParams = {
    link: '',
    hashtag: '',
    quantity: 5,
    name: '',
  };
  const [params, setParams] = useState(initialParams);
  const [fanpages, setFanpages] = useState([]);
  const [initalFanpages, setInitalFanpages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [labels, setLabels] = useState([]);

  const getAllLabels = async () => {
    const res = await SpecialService.getAllTag();
    if (res.status === OK) {
      const newData = res.data.data.map((_elt) => {
        return {
          ..._elt,
          label: _elt.name,
          value: _elt.id,
        };
      });
      setLabels(newData);
    }
  };
  useEffect(() => {
    getFanpages()
      .then((data) => {
        setFanpages(data);
        setInitalFanpages(data);
      })
      .catch(console.error);
  }, []);
  useEffect(() => {
    getAllLabels();
  }, []);

  const onSearch = async () => {
    try {
      if (params.link === '') {
        toast.error('Vui lòng nhập link fanpage !');
        return;
      }
      setIsLoading(true);
      const data = {
        fanpage: params.link,
        label: params.label,
        limit: params.quantity,
      };
      const res = await client.post(`/fanpages/import`, data);
      if (res.status === OK) {
        toast.success('Lấy dữ liệu thành công');
        getFanpages().then(setFanpages).catch(console.error);
        setParams(initialParams);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra , vui lòng thử lại !');
      setIsLoading(false);
    }
  };

  const [isShowPopup, setIsShowPopup] = useState(false);
  const location = useLocation();
  const useQuery = () => new URLSearchParams(location.search);
  const getParams = useQuery();

  useEffect(() => {
    const feedId = getParams.get('feed_id');
    if (feedId) {
      const fanpage = fanpages.find((fanpage) => {
        return fanpage.fanpage_id === feedId;
      });
      if (fanpage) {
        setIsShowPopup(fanpage);
      }
    }
  }, [fanpages, getParams]);

  return (
    <>
      <Helmet>
        <title>Theo dõi đặc biệt</title>
      </Helmet>
      <Search
        params={params}
        setParams={setParams}
        onSearch={onSearch}
        labels={labels}
      />
      <Content
        fanpages={fanpages}
        setIsShowPopup={setIsShowPopup}
        getFanpages={getFanpages}
        setFanpages={setFanpages}
        isLoading={isLoading}
        initalFanpages={initalFanpages}
        labels={labels}
      />
      {isShowPopup && (
        <SpecialFollowPopup
          setIsShowPopup={setIsShowPopup}
          fanpage={isShowPopup}
        />
      )}
    </>
  );
};

export default React.memo(SpecialFollow);
