import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Summary from './Summary';
import ContentDetail from './../CategoriesContent/ContentDetail';
import InteractionsChart from './Chart';
import LeftContent from './LeftContent';
import RightContent from './RightContent';

import client from '../../Client';
import { getTopContents } from '../../store/actions/Contents/contentActions';
import { getTakeCareFbCategories } from '../../store/actions/categories';
import {
  getTotalContents,
  getTotalFanpages,
} from '../../store/actions/Contents/contentActions';
import { OK } from '../../configs';

const Interactions = (props) => {
  const { contentDetailToShow, totalFanpages, totalContents } = useSelector(
    (state) => state.contents
  );
  const { takeCareFBCategories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [topLikeContents, setTopLikeContents] = useState([]);
  const [topShareContents, setTopShareContents] = useState([]);
  const [topCommentContents, setTopCommentContents] = useState([]);
  const [fanpages, setFanpages] = useState([]);
  const [catId, setCatId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getFanpages = async (catId = 0) => {
    let url = '/fanpages?_limit=10';
    if (catId) {
      url += `&category=${catId}`;
    }
    const res = await client.get(url);
    if (res.status === OK) {
      setFanpages(res?.data?.data?.data || []);
    }
  };
  useEffect(() => {
    dispatch(getTakeCareFbCategories());
    dispatch(getTotalFanpages());
    // dispatch(getTotalContents());
    // getFanpages();
  }, []);

  useEffect(() => {
    if (takeCareFBCategories.length > 0) {
      // get random category
      const randomIndex = Math.floor(
        Math.random() * takeCareFBCategories.length
      );
      const randomCat = takeCareFBCategories[randomIndex];
      setCatId(randomCat.cate_id);
      setSelectedCategory(randomCat);
    }
  }, [takeCareFBCategories]);

  useEffect(() => {
    if (catId) {
      // get top likes contents
      getTopContents('likes', catId, setTopLikeContents);
      // get top shares contents
      getTopContents('shares', catId, setTopShareContents);
      // get top comments contents
      getTopContents('comments', catId, setTopCommentContents);
      // get fanpages
      getFanpages(catId);
    }
  }, [catId]);

  const onCategoriesSelected = (selected) => {
    setCatId(selected.value);
    setSelectedCategory(
      takeCareFBCategories.find((cat) => cat.cate_id === selected.value)
    );
  };

  if (contentDetailToShow) {
    return <ContentDetail />;
  }
  return (
    <div className="pb-10 inline-block w-full">
      <Summary totalContents={totalContents} totalFanpages={totalFanpages} />
      <div className="w-full">
        <div className="w-7.4/10 float-left">
          <InteractionsChart />
          <LeftContent
            topLikeContents={topLikeContents}
            topShareContents={topShareContents}
            topCommentContents={topCommentContents}
          />
        </div>
        <div className="w-2.4/10 float-right">
          <RightContent
            onCategoriesSelected={onCategoriesSelected}
            childCategories={takeCareFBCategories}
            fanpages={fanpages}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default Interactions;
