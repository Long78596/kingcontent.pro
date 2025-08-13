import AddSpecialIcon from '../../../../../assets/images/icon/add-special.png';
import SingleFanpage from './SingleFanpage';
import { getSpecialFanpages } from '../../../../../store/actions/homepage';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import FanpageEmpty from './FanpageEmpty';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const SliderFanpages = (props) => {
  const { specialFanpages } = useSelector((state) => state.homepage);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSpecialFanpages());
  }, [dispatch]);

  return (
    <div className="specialFanpages flex align-baseline items-baseline">
      <div className="sliderFanpages w-full pt-1 ml-1 mt-4">
        {
          specialFanpages.length === 0 ? <div className='grid grid-cols-3 gap-2'>{[...Array(Number(3))].map((_elt, index) => (
            <FanpageEmpty key={index} />
          ))}</div> : <Carousel
            infinite={true}
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={4500}
          >
            {specialFanpages &&
              specialFanpages.length > 0 &&
              specialFanpages.map((fanpage, idx) => (
                <SingleFanpage fanpage={fanpage} key={idx} />
              ))}

          </Carousel>
        }

      </div>
    </div>
  );
};

export default SliderFanpages;
