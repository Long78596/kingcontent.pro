import { useCallback, useEffect, useState } from 'react';
import { getChildCategories } from '../../../../store/actions/categories';
import { useDispatch, useSelector } from 'react-redux';
import ByItemsSelect from './Select';
import { getContents } from '../../../../store/actions/Contents/contentActions';
import Contents from './Contents/Content';
import ContentDetail from '../../../CategoriesContent/ContentDetail';

const FeedbackContents = (props) => {
  const [catId, setCatId] = useState(0);
  const { childCategories = null } = useSelector((state) => state.categories);
  const { contentDetailToShow } = useSelector((state) => state.contents);
  const dispatch = useDispatch();

  useEffect(() => {
    if (childCategories.length === 0) {
      dispatch(getChildCategories({ parent: 252 }, setCatId));
    }
  }, [childCategories]);

  const onCategoriesSelected = useCallback((selected) => {
    setCatId(selected.value);
  }, []);

  useEffect(() => {
    if (catId) {
      const query = '&media_type=feedback';
      dispatch(getContents(catId, 1, query));
    }
  }, [catId]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h4 className="font-bold text-base">Mẫu feedback</h4>
      <div className="searchBar flex my-3 gap-2 items-center">
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <ByItemsSelect
          childCategories={childCategories}
          onCategoriesSelected={onCategoriesSelected}
          selectedCatId={catId}
        />
        <button className="bg-blue-500 text-white rounded-md p-2 w-1/6">
          Tìm
        </button>
      </div>
      <div className="contents">
        <Contents />
      </div>
      {contentDetailToShow && <ContentDetail />}
    </div>
  );
};

export default FeedbackContents;
