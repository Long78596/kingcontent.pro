import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpecialContents } from '../../../../../store/actions/homepage';
import SingleContent from './SingleContent';
import SliderEmpty from './SliderEmpty';
const SliderContents = (props) => {
  const dispatch = useDispatch();
  const { specialContents } = useSelector((state) => state.homepage);
  useEffect(() => {
    dispatch(getSpecialContents());
  }, [dispatch]);

  return (
    <div className="specialContents">
      <div className="w-full">
        {specialContents.length === 0 ? (
          <div className="flex">
            {[...Array(Number(4))].map((_elt, index) => (
              <SliderEmpty key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {specialContents &&
              specialContents.length > 0 &&
              specialContents
                .slice(0, 6)
                .map((content, idx) => (
                  <SingleContent content={content} key={idx} />
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderContents;
