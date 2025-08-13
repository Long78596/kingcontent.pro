import client from '../../Client';
import { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getChildCategories } from '../../store/actions/categories';
import {
  getTopContents,
  getTotalContents,
  getTotalFanpages,
} from '../../store/actions/Contents/contentActions';
import * as types from '../../store/types';
import ContentDetail from '../CategoriesContent/ContentDetail';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import Summary from './Summary';
import { actionGetAllFanpage } from '../../store/actions/Fanpages';
import { actionGetAllContent } from '../../store/actions/contentUserLiked';

const getFanpages = async () => {
  const { data } = await client.get('/fanpages?_limit=7');
  return data;
};

const Content = (props) => {
  const {
    contentDetailToShow,
    totalFanpages,
    totalContents,
    childCategories = [],
  } = useSelector((state) => state.contents);

  const [catId, setCatId] = useState('');
  const [deps, setDeps] = useState(1);
  const [searchStatus, setSearchStatus] = useState(false);
  const reactiveGetLikedData = () => {
    setDeps((pre) => ++pre);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actionGetAllFanpage());
    dispatch(getTotalFanpages());
    dispatch(getTotalContents());
  }, []);
  useEffect(() => {
    dispatch(actionGetAllContent());
  }, [deps]);

  const { fanpages = [] } = useSelector((state) => state.contentUserLike);

  const onCategoriesSelected = useCallback((selected) => {
    setCatId(selected.value);
  }, []);

  if (contentDetailToShow) {
    return <ContentDetail />;
  }

  return (
    <div className="pb-10">
      <Summary totalContents={totalContents} totalFanpages={totalFanpages} />
      <div className="flex gap-2">
        <div className="w-9/12">
          <LeftContent
            reactiveGetLikedData={reactiveGetLikedData}
            searchStatus={searchStatus}
            setSearchStatus={setSearchStatus}
          />
        </div>
        <div className="w-3/12">
          <RightContent
            onCategoriesSelected={onCategoriesSelected}
            childCategories={childCategories}
            fanpages={fanpages}
            searchStatus={searchStatus}
            setSearchStatus={setSearchStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Content;
