import { useCallback, useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import Messenger from './Messenger';
import Zalo from './Zalo';
import Actions from './Actions';
import ModalNewMessage from './ModalNewMessage';
import ModalNewTime from './ModalNewTime';
import SettingsForm from './SettingsForm';
import { toPng } from 'html-to-image';
import FeedbackContents from '../FeedbackContents/FeedbackContents';
import { actionAddImage } from '../../../../store/actions/createContent';
import { saveFeedbackData } from '../../../../store/actions/editor/editorActions';

const FeedbackType = (props) => {
  const { setIsShowTypes, setFeebackImage, setIsShowSingleType, reset } = props;

  const [isShowMessenger, setIsShowMessenger] = useState(false);
  const [isShowZalo, setIsShowZalo] = useState(false);

  const [isShowModalMessage, setIsShowModalMessage] = useState(false);
  const [isShowModalTime, setIsShowModalTime] = useState(false);
  const [isShowSettingsForm, setIsShowSettingsForm] = useState(false);

  const [messageType, setMessageType] = useState('send');
  const [messageData, setMessageData] = useState(null);
  const dispatch = useDispatch();

  const { feedbacksType = null, currentFeedback = 0 } = useSelector(
    (state) => state.editor
  );

  useEffect(() => {
    switch (feedbacksType) {
      case 'messenger':
        setIsShowMessenger(true);
        break;

      case 'zalo':
        setIsShowZalo(true);
        break;

      default:
        setIsShowMessenger(false);
        setIsShowZalo(false);
        break;
    }
  }, [feedbacksType]);

  const feedbackRef = useRef(null);

  const handleClickDownload = useCallback(() => {
    if (feedbackRef.current === null) {
      return;
    }

    toPng(feedbackRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'feedback-image.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [feedbackRef]);

  const handleClickSave = useCallback(() => {
    if (feedbackRef.current === null) {
      return;
    }

    toPng(feedbackRef.current, { cacheBust: true })
      .then(async (dataUrl) => {
        // save current feedback
        await dispatch(saveFeedbackData(null));
        await dispatch(
          actionAddImage({
            image: dataUrl,
            type: 'feedback',
            feedbackId: currentFeedback,
          })
        );
        reset(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [feedbackRef]);

  return (
    <div className="flex gap-3">
      <div className="w-feedback">
        <Actions
          setIsShowTypes={setIsShowTypes}
          setIsShowSingleType={setIsShowSingleType}
          setIsShowModalMessage={setIsShowModalMessage}
          setIsShowModalTime={setIsShowModalTime}
          setMessageType={setMessageType}
          handleClickDownload={handleClickDownload}
          handleClickSave={handleClickSave}
          setMessageData={setMessageData}
        />
        <div className="app_main w-feedback mx-auto relative">
          {isShowMessenger && (
            <div ref={feedbackRef}>
              <Messenger
                setIsShowSettingsForm={setIsShowSettingsForm}
                setIsShowModalMessage={setIsShowModalMessage}
                setMessageData={setMessageData}
                setMessageType={setMessageType}
              />
            </div>
          )}

          {isShowZalo && (
            <div ref={feedbackRef}>
              <Zalo
                setIsShowSettingsForm={setIsShowSettingsForm}
                setIsShowModalMessage={setIsShowModalMessage}
                setMessageData={setMessageData}
                setMessageType={setMessageType}
              />
            </div>
          )}

          {isShowModalMessage && (
            <ModalNewMessage
              messageData={messageData}
              type={messageType}
              setIsShowModalMessage={setIsShowModalMessage}
            />
          )}

          {isShowModalTime && (
            <ModalNewTime setIsShowModalTime={setIsShowModalTime} />
          )}

          {isShowSettingsForm && (
            <SettingsForm setIsShowSettingsForm={setIsShowSettingsForm} />
          )}
        </div>
      </div>
      <FeedbackContents />
    </div>
  );
};

export default FeedbackType;
