import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTakeCareFbCategories } from '../../../store/actions/categories';
import Contents from './Contents';
import SingleCategory from './SingleCategory';

const Takecare = (props) => {
  const { isAuto = false, handleAddToWaitingList = () => {} } = props;
  const dispatch = useDispatch();
  const { takeCareFBCategories = [] } = useSelector(
    (state) => state.categories
  );
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    if (!takeCareFBCategories || takeCareFBCategories.length === 0) {
      dispatch(getTakeCareFbCategories());
    }
  }, [dispatch, takeCareFBCategories]);

  return (
    <div>
      {selectedCat ? (
        <Contents
          handleAddToWaitingList={handleAddToWaitingList}
          isAuto={isAuto}
          cate={selectedCat}
          setSelectedCat={setSelectedCat}
        />
      ) : (
        <div className="grid grid-cols-6 gap-2 max-h-schedule overflow-auto pb-2 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3">
          {takeCareFBCategories.length > 0 &&
            takeCareFBCategories.map((category, i) => {
              return (
                <SingleCategory
                  key={i}
                  category={category}
                  setSelectedCat={setSelectedCat}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Takecare;
