import { useCallback } from 'react';
import { connect } from 'react-redux';
import MessengerIcon from '../../../assets/images/editor/messenger.png';
import ZaloIcon from '../../../assets/images/editor/zalo.png';
import { changeStateFeedbacksTypes } from '../../../store/actions/editor/editorActions';
import { useDispatch } from 'react-redux';

const FeedbackTypes = (props) => {
  const { setIsShowTypes, setIsShowSingleType } = props;
  const dispatch = useDispatch();

  const handleClickType = useCallback(
    (type) => {
      setIsShowTypes(false);
      setIsShowSingleType(true);
      dispatch(changeStateFeedbacksTypes(type));
    },
    [setIsShowTypes, dispatch, setIsShowSingleType]
  );
  return (
    <div className="types flex justify-center">
      <div
        className="messenger p-3 bg-white w-40 text-center mr-4 cursor-pointer rounded-xl"
        onClick={() => {
          handleClickType('messenger');
        }}
      >
        <img src={MessengerIcon} alt="messenger" className="w-full" />
        <p className="mt-2">Feedback tin nhắn trên Messenger</p>
      </div>
      <div
        className="messenger p-5 bg-white w-40 text-center cursor-pointer rounded-xl"
        onClick={() => {
          handleClickType('zalo');
        }}
      >
        <img src={ZaloIcon} alt="zalo" className="w-full" />
        <p className="mt-2">Feedback tin nhắn trên Zalo</p>
      </div>
    </div>
  );
};

export default FeedbackTypes;
