import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  actionAddImage,
  createContentToHomepage,
  toggleEditorText,
} from '../../../../store/actions/createContent';
import { TYPE_GO_CONTENT, TYPE_GO_PAGE } from '../../../../utils/utilityFunc';
import CalendarEvents from './CalendarEvents';
import { Link } from 'react-router-dom';
import ModalEvent from './ModalEvent';
import Subjects from './Subjects';
import SingleSubject from './Subjects/SingleSubject';
import { setContentDetailToShow } from '../../../../store/actions/Contents/contentActions';
const RightContent = () => {
  const { trendding, topicSelected } = useSelector((state) => state.homepage);
  const [isShowModal, setIsShowModal] = useState(false);
  const [type, setType] = useState('');
  const dispatch = useDispatch();
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    event_date: '',
    event_icon: '',
    description: '',
  });
  const openPopup = (item, type) => {
    setType(type);
    setCurrentEvent(item);
    setIsShowModal(true);
    dispatch(
      setContentDetailToShow({
        ...item,
        post_text: item.description,
        images: [item.image],
        writed: true,
      })
    );
  };
  return (
    <div className="rightContainer bg-white rounded-lg shadow-md p-5">
      {/* <UserInfo /> */}
      <CalendarEvents />
      <div className="w-full border-2 border-gray-300 border-dashed mt-2 mb-2"></div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold uppercase text-base">Đang thịnh hành</h2>
        <span className="text-blue-500 underline font-bold">
          <Link to="/dang-thinh-hanh" className="italic ml-auto mr-5">
            Xem tất cả
          </Link>
        </span>
      </div>
      <div className="listSubjects mt-3">
        <PerfectScrollbar style={{ maxHeight: '800px' }}>
          {trendding &&
            trendding.length > 0 &&
            trendding.map((subject, idx) => (
              <SingleSubject
                subject={subject}
                key={idx}
                showFooter={true}
                className={'rounded-md'}
                width={'w-2'}
                height="h-2"
                likes={subject.likes}
                comment={subject.comments}
                openPopup={openPopup}
                shares={subject.shared}
                type={TYPE_GO_CONTENT}
                idx={idx}
              />
            ))}
        </PerfectScrollbar>
      </div>
      <div className="w-full border-2 border-gray-300 border-dashed mt-2 mb-2"></div>
      <Subjects openPopup={openPopup} type={TYPE_GO_PAGE} />
    </div>
  );
};

export default RightContent;
