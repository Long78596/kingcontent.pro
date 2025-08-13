import AddSpecialIcon from '../../../../../assets/images/icon/add-special.png';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PopupSelectCate from './popupSelectCate';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChosenCategories } from '../../../../../store/actions/homepage';
import SingleCate from './SingleCate';

const Subjects = () => {
  const [isOpenPopup, setisOpenPopup] = useState(false);
  const togglePopup = () => {
    setisOpenPopup(false);
  };
  const { chosenCategories = [] } = useSelector((state) => state.homepage);
  const dispatch = useDispatch();

  useEffect(() => {
    setisOpenPopup(false);
    dispatch(getChosenCategories());
  }, []);

  return (
    <div className="userSubjects mt-3">
      <h4 className="uppercase font-bold text-base">Chủ đề của bạn</h4>
      <div className="newSubject mt-3">
        <button
          className="flex items-center"
          onClick={() => setisOpenPopup(true)}
        >
          <img src={AddSpecialIcon} alt="Thêm chủ đề" className="w-16 h-16" />
          <span className="text-sm font-bold pl-2">Thêm</span>
        </button>
      </div>
      <div className="listSubjects mt-3">
        <PerfectScrollbar style={{ maxHeight: '800px' }}>
          {chosenCategories &&
            chosenCategories.length > 0 &&
            chosenCategories.map((category, idx) => (
              <SingleCate category={category} key={idx} />
            ))}
        </PerfectScrollbar>
      </div>
      <PopupSelectCate isOpen={isOpenPopup} toggle={togglePopup} />
    </div>
  );
};

export default Subjects;
