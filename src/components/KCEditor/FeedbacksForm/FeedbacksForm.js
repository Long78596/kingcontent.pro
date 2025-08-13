import { changeStateFeedbacksForm } from '../../../store/actions/editor/editorActions';
import { ChatAlt2Icon, XIcon } from '@heroicons/react/outline';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import FeedbackType from './FeedbackType';
import FeedbackTypes from './FeedbackTypes';
import SaveFeedback from './SaveFeedback';

const FeedbacksForm = (props) => {
  const [isShowTypes, setIsShowTypes] = useState(true);
  const [isShowSingleType, setIsShowSingleType] = useState(false);
  const [feebackImage, setFeebackImage] = useState('');

  const { currentFeedback = 0 } = useSelector((state) => state.editor);
  const dispatch = useDispatch();

  const reset = () => {
    dispatch(changeStateFeedbacksForm(false));
  };

  useEffect(() => {
    if (currentFeedback) {
      setIsShowTypes(false);
      setIsShowSingleType(true);
    }
  }, [currentFeedback]);

  return (
    <>
      <div
        className="opacity-25 fixed inset-0 z-9999 bg-black"
        onClick={() => changeStateFeedbacksForm(false)}
      ></div>
      <div className="feedbacksForm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9999 outline-none focus:outline-none max-h-screen h-full">
        <div className="relative w-5/6 my-6 mx-auto">
          <div className="w-full h-14 flex items-center justify-between py-0 px-5 bg-createContent-blueClr text-white outline-none rounded-t-lg">
            <ChatAlt2Icon className="h-8 w-8" />
            <h2 className="text-base uppercase font-semibold ">Tạo feedback</h2>
            <XIcon
              className="bg-createContent-lightBlueClr rounded-full h-8 w-8 p-1 text-createContent-grayClr transition-all cursor-pointer hover:text-createContent-blackClr "
              onClick={() => reset()}
            />
          </div>
          <div
            className="rounded-b-lg shadow-lg relative flex flex-col w-full bg-editor-feedbackBg outline-none focus:outline-none p-5"
            style={{
              height: isShowSingleType ? 'calc(100vh - 100px)' : 'auto',
            }}
          >
            <PerfectScrollbar className="">
              {isShowTypes && (
                <FeedbackTypes
                  setIsShowTypes={setIsShowTypes}
                  setIsShowSingleType={setIsShowSingleType}
                />
              )}

              {isShowSingleType && (
                <FeedbackType
                  reset={reset}
                  setFeebackImage={setFeebackImage}
                  setIsShowTypes={setIsShowTypes}
                  setIsShowSingleType={setIsShowSingleType}
                />
              )}

              {/* tmp hide this component */}
              {feebackImage && false && (
                <SaveFeedback
                  feebackImage={feebackImage}
                  setFeebackImage={setFeebackImage}
                />
              )}
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbacksForm;
